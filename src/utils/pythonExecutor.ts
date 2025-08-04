// Executor de Python usando Pyodide (Python real en WebAssembly)
import { loadPyodide, type PyodideInterface } from "pyodide";

export class PythonExecutor {
  private pyodide: PyodideInterface | null = null;
  private isInitialized: boolean = false;
  private output: string[] = [];
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initializePyodide();
  }

  // Método para inicializar Pyodide de forma asíncrona
  private async initializePyodide(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Cargar Pyodide desde CDN oficial
        this.pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.0/full/",
          stdout: (text: string) => {
            if (text.trim()) {
              this.output.push(text.trim());
            }
          },
          stderr: (text: string) => {
            if (text.trim()) {
              this.output.push(text.trim());
            }
          },
        });

        // Configurar captura de output
        this.setupOutputCapture();

        this.isInitialized = true;
        console.log("Pyodide inicializado correctamente");
      } catch (error) {
        console.error("Error al inicializar Pyodide:", error);
        throw new Error("No se pudo cargar Pyodide");
      }
    })();

    return this.initPromise;
  }

  // Configurar la captura de salida de Python
  private setupOutputCapture(): void {
    if (!this.pyodide) return;

    // Configurar captura compatible con Pyodide
    this.pyodide.runPython(`
import sys
from io import StringIO

# Crear un StringIO para capturar salida
_captured_output = StringIO()

# Guardar funciones originales
_original_print = print

def capture_print(*args, **kwargs):
    """Función personalizada para capturar prints"""
    # Escribir a nuestro StringIO
    _original_print(*args, file=_captured_output, **kwargs)

# Reemplazar print en el namespace global
import builtins
builtins.print = capture_print

def get_captured_output():
    """Obtener la salida capturada y limpiar el buffer"""
    output = _captured_output.getvalue()
    _captured_output.seek(0)
    _captured_output.truncate(0)
    return output
    `);
  }

  // Método público para asegurar que Pyodide esté listo
  public async ensureReady(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializePyodide();
    }
  }

  // Resetear el entorno de Python
  reset(): void {
    this.output = [];
    if (this.pyodide && this.isInitialized) {
      try {
        // Limpiar variables globales manteniendo los built-ins
        this.pyodide.runPython(`
# Limpiar variables definidas por el usuario
user_vars = [name for name in globals().keys() 
            if not name.startswith('_') and name not in [
                'sys', 'StringIO', 'math', 'random', 'os', 'json', 
                'capture_print', 'get_captured_output', 'builtins'
            ]]
for var in user_vars:
    del globals()[var]

# Limpiar output capturado
if 'get_captured_output' in globals():
    get_captured_output()
        `);
      } catch (error) {
        console.error("Error al resetear el entorno:", error);
      }
    }
  }

  // Ejecutar código Python
  async execute(code: string): Promise<{ output: string; error?: string }> {
    try {
      // Asegurar que Pyodide esté inicializado
      await this.ensureReady();

      if (!this.pyodide) {
        return {
          output: "",
          error: "Pyodide no está disponible",
        };
      }

      // Limpiar output anterior
      this.output = [];

      // Limpiar cualquier output previo
      this.pyodide.runPython("get_captured_output()");

      // Ejecutar el código
      try {
        // Verificar si el código termina con una expresión
        const lines = code.trim().split("\n");
        const lastLine = lines[lines.length - 1].trim();

        // Si la última línea es una expresión simple (no statement)
        if (
          lastLine &&
          !lastLine.includes("=") &&
          !lastLine.startsWith("if ") &&
          !lastLine.startsWith("for ") &&
          !lastLine.startsWith("while ") &&
          !lastLine.startsWith("def ") &&
          !lastLine.startsWith("class ") &&
          !lastLine.startsWith("import ") &&
          !lastLine.startsWith("from ") &&
          !lastLine.startsWith("#") &&
          !lastLine.includes("print(") &&
          lines.length > 1
        ) {
          // Ejecutar todo el código excepto la última línea
          const codeWithoutLast = lines.slice(0, -1).join("\n");
          if (codeWithoutLast.trim()) {
            this.pyodide.runPython(codeWithoutLast);
          }

          // Evaluar la última línea y mostrar el resultado si no es None
          this.pyodide.runPython(`
result = ${lastLine}
if result is not None:
    print(result)
          `);
        } else {
          // Ejecutar todo el código normalmente
          this.pyodide.runPython(code);
        }

        // Obtener la salida capturada
        const capturedOutput = this.pyodide.runPython("get_captured_output()");

        return {
          output: capturedOutput || "# Código ejecutado correctamente",
        };
      } catch (pythonError: any) {
        // Capturar errores de Python y formatearlos
        let errorMessage = "";

        if (pythonError.message) {
          errorMessage = pythonError.message;

          // Limpiar el mensaje de error para que sea más legible
          errorMessage = errorMessage
            .replace(/File "<exec>", line \d+, in <module>\n/g, "")
            .replace(/File "<string>", line \d+, in <module>\n/g, "")
            .replace(/Traceback \(most recent call last\):\n/g, "")
            .trim();
        } else {
          errorMessage = "Error al ejecutar el código Python";
        }

        // Obtener cualquier output que se haya generado antes del error
        const partialOutput = this.pyodide.runPython("get_captured_output()");

        return {
          output: partialOutput || "",
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Error en execute:", error);
      return {
        output: "",
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Método para instalar paquetes Python (opcional)
  async installPackage(packageName: string): Promise<boolean> {
    try {
      await this.ensureReady();
      if (!this.pyodide) return false;

      await this.pyodide.loadPackage(packageName);
      return true;
    } catch (error) {
      console.error(`Error al instalar paquete ${packageName}:`, error);
      return false;
    }
  }

  // Método para verificar si Pyodide está listo
  public isReady(): boolean {
    return this.isInitialized && this.pyodide !== null;
  }

  // Método para obtener información del estado
  public getStatus(): { ready: boolean; version?: string } {
    if (!this.isReady()) {
      return { ready: false };
    }

    try {
      const version =
        this.pyodide?.runPython("import sys; sys.version") || "unknown";
      return { ready: true, version };
    } catch {
      return { ready: true };
    }
  }
}
