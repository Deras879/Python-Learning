// Simulador avanzado de Python para ejercicios educativos
export class PythonExecutor {
  private variables: Map<string, any> = new Map();
  private output: string[] = [];
  private functions: Map<string, { params: string[]; body: string[] }> =
    new Map();
  private classes: Map<string, any> = new Map();
  private imports: Set<string> = new Set();
  private indentLevel: number = 0;
  private currentBlock: string[] = [];
  private blockType: string = "";
  private forLoops: Array<{
    variable: string;
    iterable: any[];
    index: number;
    body: string[];
  }> = [];
  private whileLoops: Array<{ condition: string; body: string[] }> = [];
  private ifBlocks: Array<{
    condition: string;
    body: string[];
    executed: boolean;
  }> = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.variables.clear();
    this.output = [];
    this.functions.clear();
    this.classes.clear();
    this.imports.clear();
    this.indentLevel = 0;
    this.currentBlock = [];
    this.blockType = "";
    this.forLoops = [];
    this.whileLoops = [];
    this.ifBlocks = [];

    // Variables globales básicas
    this.variables.set("True", true);
    this.variables.set("False", false);
    this.variables.set("None", null);

    // Funciones built-in adicionales
    this.setupBuiltinFunctions();
  }

  private setupBuiltinFunctions() {
    // range() function
    this.variables.set("range", (...args: number[]) => {
      if (args.length === 1)
        return Array.from({ length: args[0] }, (_, i) => i);
      if (args.length === 2)
        return Array.from({ length: args[1] - args[0] }, (_, i) => i + args[0]);
      if (args.length === 3) {
        const [start, stop, step] = args;
        const result = [];
        for (let i = start; i < stop; i += step) result.push(i);
        return result;
      }
      return [];
    });
  }

  execute(code: string): { output: string; error?: string } {
    this.reset();

    try {
      // Limpiar el código y dividir en líneas
      const lines = code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "" && !line.startsWith("#"));

      if (lines.length === 0) {
        return { output: "# No hay código para ejecutar" };
      }

      for (const line of lines) {
        this.executeLine(line);
      }

      return {
        output:
          this.output.length > 0
            ? this.output.join("\n")
            : "# Código ejecutado sin salida",
      };
    } catch (error) {
      return {
        output: this.output.join("\n"),
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al ejecutar el código",
      };
    }
  }

  private executeLine(line: string) {
    try {
      const originalLine = line;
      const trimmedLine = line.trim();

      // Calcular nivel de indentación
      const currentIndent = line.length - line.trimStart().length;

      // Si estamos en un bloque y la indentación disminuye, ejecutar el bloque
      if (
        this.currentBlock.length > 0 &&
        currentIndent <= this.indentLevel &&
        trimmedLine !== ""
      ) {
        this.executeBlock();
      }

      // Líneas vacías o comentarios
      if (trimmedLine === "" || trimmedLine.startsWith("#")) {
        return;
      }

      // Estructuras de control que requieren bloques
      if (this.isControlStructure(trimmedLine)) {
        this.handleControlStructure(trimmedLine, currentIndent);
        return;
      }

      // Si estamos en un bloque, agregar la línea al bloque
      if (this.currentBlock.length > 0 && currentIndent > this.indentLevel) {
        this.currentBlock.push(originalLine);
        return;
      }

      // Manejar definición de funciones
      if (trimmedLine.startsWith("def ")) {
        this.handleFunctionDefinition(trimmedLine, currentIndent);
        return;
      }

      // Manejar definición de clases
      if (trimmedLine.startsWith("class ")) {
        this.handleClassDefinition(trimmedLine, currentIndent);
        return;
      }

      // Manejar imports
      if (
        trimmedLine.startsWith("import ") ||
        trimmedLine.startsWith("from ")
      ) {
        this.handleImport(trimmedLine);
        return;
      }

      // Manejar llamadas a funciones definidas por el usuario
      if (this.isFunctionCall(trimmedLine)) {
        this.handleFunctionCall(trimmedLine);
        return;
      }

      // Manejar print()
      if (trimmedLine.includes("print(")) {
        this.handlePrint(trimmedLine);
        return;
      }

      // Manejar asignaciones de variables
      if (trimmedLine.includes("=") && !this.isComparison(trimmedLine)) {
        this.handleAssignment(trimmedLine);
        return;
      }

      // Manejar input()
      if (trimmedLine.includes("input(")) {
        this.handleInput(trimmedLine);
        return;
      }

      // Manejar funciones built-in
      if (this.isBuiltinFunction(trimmedLine)) {
        this.handleBuiltinFunction(trimmedLine);
        return;
      }

      // Manejar expresiones simples
      if (this.isSimpleExpression(trimmedLine)) {
        const result = this.evaluateExpression(trimmedLine);
        if (result !== undefined && result !== null) {
          this.output.push(String(result));
        }
        return;
      }

      // Si no se puede procesar, mostrar como comentario
      this.output.push(`# Línea no procesada: ${trimmedLine}`);
    } catch (error) {
      throw new Error(
        `Error en línea "${line}": ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  private isComparison(line: string): boolean {
    return (
      line.includes("==") ||
      line.includes("!=") ||
      line.includes("<=") ||
      line.includes(">=") ||
      (line.includes("<") && !line.includes("=")) ||
      (line.includes(">") && !line.includes("="))
    );
  }

  private handlePrint(line: string) {
    // Extraer contenido de print()
    const match = line.match(/print\s*\((.*)\)/);
    if (match) {
      const content = match[1].trim();

      if (content === "") {
        this.output.push("");
        return;
      }

      // Manejar múltiples argumentos separados por comas
      const args = this.parseArguments(content);
      const results = args.map((arg) => this.evaluateExpression(arg.trim()));

      this.output.push(results.join(" "));
    }
  }

  private parseArguments(content: string): string[] {
    // Si es una expresión ternaria simple, retornarla como un solo argumento
    if (
      content.includes(" if ") &&
      content.includes(" else ") &&
      !content.includes(",")
    ) {
      return [content];
    }

    const args: string[] = [];
    let current = "";
    let inString = false;
    let stringChar = "";
    let parenLevel = 0;
    let ternaryLevel = 0;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChars = content.substring(i, i + 4);
      const prevChars = content.substring(Math.max(0, i - 5), i);

      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
        current += char;
      } else if (inString && char === stringChar) {
        inString = false;
        current += char;
      } else if (!inString && char === "(") {
        parenLevel++;
        current += char;
      } else if (!inString && char === ")") {
        parenLevel--;
        current += char;
      } else if (!inString && nextChars === " if ") {
        ternaryLevel++;
        current += char;
      } else if (!inString && prevChars.endsWith(" else") && char === " ") {
        ternaryLevel = Math.max(0, ternaryLevel - 1);
        current += char;
      } else if (
        !inString &&
        char === "," &&
        parenLevel === 0 &&
        ternaryLevel === 0
      ) {
        args.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      args.push(current.trim());
    }

    return args;
  }

  private handleAssignment(line: string) {
    // Manejar operadores de asignación compuestos
    const compoundOperators = ["+=", "-=", "*=", "/=", "//=", "%=", "**="];

    for (const op of compoundOperators) {
      if (line.includes(op)) {
        const [varName, valueExpr] = line.split(op).map((s) => s.trim());

        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
          throw new Error(`Nombre de variable no válido: ${varName}`);
        }

        const currentValue = this.variables.get(varName) || 0;
        const newValue = this.evaluateExpression(valueExpr);

        let result;
        switch (op) {
          case "+=":
            result =
              typeof currentValue === "string" || typeof newValue === "string"
                ? String(currentValue) + String(newValue)
                : Number(currentValue) + Number(newValue);
            break;
          case "-=":
            result = Number(currentValue) - Number(newValue);
            break;
          case "*=":
            result = Number(currentValue) * Number(newValue);
            break;
          case "/=":
            result = Number(currentValue) / Number(newValue);
            break;
          case "//=":
            result = Math.floor(Number(currentValue) / Number(newValue));
            break;
          case "%=":
            result = Number(currentValue) % Number(newValue);
            break;
          case "**=":
            result = Math.pow(Number(currentValue), Number(newValue));
            break;
          default:
            result = newValue;
        }

        this.variables.set(varName, result);
        return;
      }
    }

    // Asignación simple o múltiple
    const equalIndex = line.indexOf("=");
    const leftSide = line.substring(0, equalIndex).trim();
    const rightSide = line.substring(equalIndex + 1).trim();

    // Detectar asignación múltiple (si hay comas en el lado izquierdo)
    if (leftSide.includes(",")) {
      // Asignación múltiple: nombre, apellido, ciudad = "Tu Nombre", "Tu Apellido", "Tu Ciudad"
      const varNames = leftSide.split(",").map((name) => name.trim());
      const values = this.parseArguments(rightSide);

      if (varNames.length !== values.length) {
        throw new Error(
          `Número de variables (${varNames.length}) no coincide con número de valores (${values.length})`
        );
      }

      // Validar nombres de variables
      for (const varName of varNames) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
          throw new Error(`Nombre de variable no válido: ${varName}`);
        }
      }

      // Asignar cada valor a su variable correspondiente
      for (let i = 0; i < varNames.length; i++) {
        const value = this.evaluateExpression(values[i].trim());
        this.variables.set(varNames[i], value);
      }
    } else {
      // Asignación simple
      const varName = leftSide;
      const valueExpr = rightSide;

      // Validar nombre de variable
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
        throw new Error(`Nombre de variable no válido: ${varName}`);
      }

      const value = this.evaluateExpression(valueExpr);
      this.variables.set(varName, value);
    }
  }

  private handleInput(line: string) {
    const match = line.match(/(\w+)\s*=\s*input\s*\((.*)\)/);
    if (match) {
      const varName = match[1];
      const promptExpr = match[2].trim();

      let prompt = "";
      if (promptExpr) {
        prompt = String(this.evaluateExpression(promptExpr));
      }

      // Simular input con valores de ejemplo
      const simulatedInputs = [
        "usuario",
        "25",
        "Python",
        "Hola mundo",
        "42",
        "3.14",
      ];
      const inputValue =
        simulatedInputs[Math.floor(Math.random() * simulatedInputs.length)];

      this.variables.set(varName, inputValue);

      if (prompt) {
        this.output.push(`${prompt}${inputValue}`);
      }
    }
  }

  private evaluateExpression(expr: string): any {
    expr = expr.trim();

    // Expresiones ternarias (conditional expressions) - DEBE IR ANTES que strings literales
    if (expr.includes(" if ") && expr.includes(" else ")) {
      return this.evaluateTernaryExpression(expr);
    }

    // Strings literales
    if (
      (expr.startsWith('"') && expr.endsWith('"')) ||
      (expr.startsWith("'") && expr.endsWith("'"))
    ) {
      return this.processEscapeSequences(expr.slice(1, -1));
    }

    // F-strings
    if (expr.startsWith('f"') || expr.startsWith("f'")) {
      return this.handleFString(expr);
    }

    // Números enteros
    if (/^-?\d+$/.test(expr)) {
      return parseInt(expr, 10);
    }

    // Números decimales
    if (/^-?\d+\.\d+$/.test(expr)) {
      return parseFloat(expr);
    }

    // Booleanos y None
    if (expr === "True") return true;
    if (expr === "False") return false;
    if (expr === "None") return null;

    // Variables simples
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr) && this.variables.has(expr)) {
      return this.variables.get(expr);
    }

    // Operaciones matemáticas
    if (this.containsMathOperators(expr)) {
      return this.evaluateMathExpression(expr);
    }

    // Concatenación de strings
    if (expr.includes("+") && this.containsStrings(expr)) {
      return this.evaluateStringConcatenation(expr);
    }

    // Comparaciones
    if (this.isComparison(expr)) {
      return this.evaluateComparison(expr);
    }

    // Lista simple
    if (expr.startsWith("[") && expr.endsWith("]")) {
      return this.evaluateList(expr);
    }

    // Diccionario simple
    if (expr.startsWith("{") && expr.endsWith("}")) {
      return this.evaluateDictionary(expr);
    }

    // Tupla simple
    if (expr.startsWith("(") && expr.endsWith(")") && expr.includes(",")) {
      return this.evaluateTuple(expr);
    }

    // Operadores lógicos
    if (
      expr.includes(" and ") ||
      expr.includes(" or ") ||
      expr.startsWith("not ")
    ) {
      return this.evaluateLogicalExpression(expr);
    }

    // Operadores de pertenencia (in, not in)
    if (expr.includes(" in ") || expr.includes(" not in ")) {
      return this.evaluateMembershipExpression(expr);
    }

    // Acceso a índices y propiedades
    if (expr.includes("[") && expr.includes("]") && !expr.startsWith("[")) {
      return this.evaluateIndexAccess(expr);
    }

    // Acceso a atributos con punto
    if (expr.includes(".") && /^[a-zA-Z_]\w*\.[a-zA-Z_]\w*/.test(expr)) {
      return this.evaluateAttributeAccess(expr);
    }

    // Si es una variable no definida, retornar el nombre
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) {
      throw new Error(`Variable '${expr}' no está definida`);
    }

    return expr;
  }

  // Métodos para estructuras de control
  private isControlStructure(line: string): boolean {
    return (
      line.startsWith("if ") ||
      line.startsWith("elif ") ||
      line.startsWith("else:") ||
      line.startsWith("for ") ||
      line.startsWith("while ") ||
      line.startsWith("try:") ||
      line.startsWith("except") ||
      line.startsWith("finally:")
    );
  }

  private handleControlStructure(line: string, indent: number) {
    this.indentLevel = indent;
    this.currentBlock = [];

    if (line.startsWith("if ")) {
      this.blockType = "if";
      const condition = line.substring(3, line.indexOf(":")).trim();
      this.ifBlocks = [{ condition, body: [], executed: false }];
    } else if (line.startsWith("elif ")) {
      this.blockType = "elif";
      const condition = line.substring(5, line.indexOf(":")).trim();
      this.ifBlocks.push({ condition, body: [], executed: false });
    } else if (line.startsWith("else:")) {
      this.blockType = "else";
      this.ifBlocks.push({ condition: "True", body: [], executed: false });
    } else if (line.startsWith("for ")) {
      this.blockType = "for";
      const match = line.match(/for\s+(\w+)\s+in\s+(.+):/);
      if (match) {
        const variable = match[1];
        const iterableExpr = match[2].trim();
        const iterable = this.evaluateExpression(iterableExpr);
        this.forLoops = [
          {
            variable,
            iterable: Array.isArray(iterable) ? iterable : [],
            index: 0,
            body: [],
          },
        ];
      }
    } else if (line.startsWith("while ")) {
      this.blockType = "while";
      const condition = line.substring(6, line.indexOf(":")).trim();
      this.whileLoops = [{ condition, body: [] }];
    }
  }

  private executeBlock() {
    try {
      if (
        this.blockType === "if" ||
        this.blockType === "elif" ||
        this.blockType === "else"
      ) {
        this.executeIfBlock();
      } else if (this.blockType === "for") {
        this.executeForLoop();
      } else if (this.blockType === "while") {
        this.executeWhileLoop();
      }
    } finally {
      this.currentBlock = [];
      this.blockType = "";
      this.indentLevel = 0;
    }
  }

  private executeIfBlock() {
    for (const ifBlock of this.ifBlocks) {
      if (!ifBlock.executed) {
        ifBlock.body = [...this.currentBlock];
        const conditionResult = this.evaluateExpression(ifBlock.condition);
        if (conditionResult) {
          this.executeBlockBody(ifBlock.body);
          ifBlock.executed = true;
          break;
        }
      }
    }
    this.ifBlocks = [];
  }

  private executeForLoop() {
    if (this.forLoops.length > 0) {
      const loop = this.forLoops[0];
      loop.body = [...this.currentBlock];

      for (const item of loop.iterable) {
        this.variables.set(loop.variable, item);
        this.executeBlockBody(loop.body);
      }
    }
    this.forLoops = [];
  }

  private executeWhileLoop() {
    if (this.whileLoops.length > 0) {
      const loop = this.whileLoops[0];
      loop.body = [...this.currentBlock];

      let iterations = 0;
      const maxIterations = 1000; // Prevenir bucles infinitos

      while (
        this.evaluateExpression(loop.condition) &&
        iterations < maxIterations
      ) {
        this.executeBlockBody(loop.body);
        iterations++;
      }

      if (iterations >= maxIterations) {
        this.output.push(
          "# Advertencia: Bucle while detenido para prevenir bucle infinito"
        );
      }
    }
    this.whileLoops = [];
  }

  private executeBlockBody(body: string[]) {
    for (const line of body) {
      this.executeLine(line);
    }
  }

  // Métodos para funciones
  private handleFunctionDefinition(line: string, indent: number) {
    const match = line.match(/def\s+(\w+)\s*\((.*?)\):/);
    if (match) {
      const functionName = match[1];
      const paramsStr = match[2].trim();
      const params = paramsStr ? paramsStr.split(",").map((p) => p.trim()) : [];

      this.blockType = "function";
      this.indentLevel = indent;
      this.currentBlock = [];
      this.functions.set(functionName, { params, body: [] });
    }
  }

  private isFunctionCall(line: string): boolean {
    const match = line.match(/^(\w+)\s*\(/);
    return match ? this.functions.has(match[1]) : false;
  }

  private handleFunctionCall(line: string) {
    const match = line.match(/^(\w+)\s*\((.*?)\)/);
    if (match) {
      const functionName = match[1];
      const argsStr = match[2].trim();
      const func = this.functions.get(functionName);

      if (func) {
        // Evaluar argumentos
        const args = argsStr
          ? this.parseArguments(argsStr).map((arg) =>
              this.evaluateExpression(arg)
            )
          : [];

        // Guardar estado actual de variables
        const savedVars = new Map(this.variables);

        // Asignar parámetros
        func.params.forEach((param, index) => {
          this.variables.set(param, args[index] || null);
        });

        // Ejecutar cuerpo de la función
        this.executeBlockBody(func.body);

        // Restaurar variables (excepto globales modificadas)
        this.variables = savedVars;
      }
    }
  }

  // Métodos para clases e imports
  private handleClassDefinition(line: string, indent: number) {
    const match = line.match(/class\s+(\w+)(?:\(([^)]*)\))?:/);
    if (match) {
      const className = match[1];
      this.blockType = "class";
      this.indentLevel = indent;
      this.currentBlock = [];
      this.classes.set(className, { methods: {}, properties: {} });
    }
  }

  private handleImport(line: string) {
    if (line.startsWith("import ")) {
      const module = line.substring(7).trim();
      this.imports.add(module);
      // Simular algunos módulos básicos
      if (module === "math") {
        this.variables.set("math", {
          pi: Math.PI,
          e: Math.E,
          sqrt: Math.sqrt,
          pow: Math.pow,
          abs: Math.abs,
          floor: Math.floor,
          ceil: Math.ceil,
          round: Math.round,
        });
      } else if (module === "random") {
        this.variables.set("random", {
          random: Math.random,
          randint: (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1)) + min,
          choice: (arr: any[]) => arr[Math.floor(Math.random() * arr.length)],
        });
      }
    } else if (line.startsWith("from ")) {
      const match = line.match(/from\s+(\w+)\s+import\s+(.+)/);
      if (match) {
        const module = match[1];
        const items = match[2].split(",").map((item) => item.trim());
        this.imports.add(module);
        // Importar elementos específicos
        if (module === "math") {
          const mathModule = {
            pi: Math.PI,
            e: Math.E,
            sqrt: Math.sqrt,
            pow: Math.pow,
            abs: Math.abs,
            floor: Math.floor,
            ceil: Math.ceil,
            round: Math.round,
          };
          items.forEach((item) => {
            if (item in mathModule) {
              this.variables.set(item, (mathModule as any)[item]);
            }
          });
        }
      }
    }
  }

  private processEscapeSequences(str: string): string {
    // Procesar las secuencias de escape comunes de Python
    return str
      .replace(/\\n/g, "\n") // Salto de línea
      .replace(/\\t/g, "\t") // Tabulación
      .replace(/\\r/g, "\r") // Retorno de carro
      .replace(/\\b/g, "\b") // Backspace
      .replace(/\\f/g, "\f") // Form feed
      .replace(/\\v/g, "\v") // Tabulación vertical
      .replace(/\\0/g, "\0") // Carácter nulo
      .replace(/\\\\/g, "\\") // Barra invertida literal
      .replace(/\\'/g, "'") // Comilla simple literal
      .replace(/\\"/g, '"') // Comilla doble literal
      .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => {
        // Secuencias hexadecimales como \x41 = 'A'
        return String.fromCharCode(parseInt(hex, 16));
      })
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
        // Secuencias Unicode como \u0041 = 'A'
        return String.fromCharCode(parseInt(hex, 16));
      });
  }

  private handleFString(fstring: string): string {
    // Remover f" o f' del inicio y " o ' del final
    let content = fstring.slice(2, -1);

    // Reemplazar variables en {}
    content = content.replace(/\{([^}]+)\}/g, (match, varExpr) => {
      const value = this.evaluateExpression(varExpr.trim());
      return value !== undefined ? String(value) : match;
    });

    // Procesar secuencias de escape después de reemplazar variables
    return this.processEscapeSequences(content);
  }

  private containsMathOperators(expr: string): boolean {
    return /[+\-*/%()]|\*\*|\/\//.test(expr) && !/["']/.test(expr);
  }

  private containsStrings(expr: string): boolean {
    return /["']/.test(expr);
  }

  private evaluateMathExpression(expr: string): number {
    // Reemplazar variables por sus valores
    let processedExpr = expr;
    for (const [varName, value] of this.variables.entries()) {
      if (typeof value === "number") {
        const regex = new RegExp(`\\b${varName}\\b`, "g");
        processedExpr = processedExpr.replace(regex, String(value));
      }
    }

    try {
      // Manejar operadores específicos de Python
      processedExpr = processedExpr.replace(/\*\*/g, "^"); // Exponenciación
      processedExpr = processedExpr.replace(/\/\//g, "÷"); // División entera (placeholder)

      // Evaluación segura de expresiones matemáticas básicas
      if (!/^[\d\s+\-*/().^÷%]+$/.test(processedExpr)) {
        throw new Error("Expresión no válida");
      }

      // Manejar división entera
      if (processedExpr.includes("÷")) {
        const parts = processedExpr.split("÷");
        if (parts.length === 2) {
          const left = this.evaluateMathExpression(parts[0].trim());
          const right = this.evaluateMathExpression(parts[1].trim());
          return Math.floor(left / right);
        }
      }

      // Convertir ^ a Math.pow para exponenciación
      processedExpr = processedExpr.replace(
        /(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g,
        (_, base, exp) => `Math.pow(${base}, ${exp})`
      );

      const result = Function(`"use strict"; return (${processedExpr})`)();
      return typeof result === "number" && !isNaN(result) ? result : 0;
    } catch {
      throw new Error(`No se puede evaluar la expresión matemática: ${expr}`);
    }
  }

  private evaluateStringConcatenation(expr: string): string {
    const parts = expr.split("+").map((part) => part.trim());
    return parts.map((part) => String(this.evaluateExpression(part))).join("");
  }

  private isSimpleExpression(expr: string): boolean {
    return /^[\w\s+\-*/().'"]+$/.test(expr) && !expr.includes("=");
  }

  private evaluateComparison(expr: string): boolean {
    // Manejar comparaciones simples
    let operator = "";
    let left = "";
    let right = "";

    if (expr.includes("==")) {
      [left, right] = expr.split("==").map((s) => s.trim());
      operator = "==";
    } else if (expr.includes("!=")) {
      [left, right] = expr.split("!=").map((s) => s.trim());
      operator = "!=";
    } else if (expr.includes("<=")) {
      [left, right] = expr.split("<=").map((s) => s.trim());
      operator = "<=";
    } else if (expr.includes(">=")) {
      [left, right] = expr.split(">=").map((s) => s.trim());
      operator = ">=";
    } else if (expr.includes("<")) {
      [left, right] = expr.split("<").map((s) => s.trim());
      operator = "<";
    } else if (expr.includes(">")) {
      [left, right] = expr.split(">").map((s) => s.trim());
      operator = ">";
    }

    if (!operator) return false;

    const leftVal = this.evaluateExpression(left);
    const rightVal = this.evaluateExpression(right);

    switch (operator) {
      case "==":
        return leftVal == rightVal;
      case "!=":
        return leftVal != rightVal;
      case "<=":
        return leftVal <= rightVal;
      case ">=":
        return leftVal >= rightVal;
      case "<":
        return leftVal < rightVal;
      case ">":
        return leftVal > rightVal;
      default:
        return false;
    }
  }

  private evaluateList(expr: string): any[] {
    // Remover corchetes
    const content = expr.slice(1, -1).trim();

    if (content === "") return [];

    // Parsear elementos de la lista
    const elements = this.parseArguments(content);
    return elements.map((element) => this.evaluateExpression(element));
  }

  private isBuiltinFunction(line: string): boolean {
    const builtinFunctions = [
      "len(",
      "str(",
      "int(",
      "float(",
      "type(",
      "range(",
      "list(",
      "dict(",
      "tuple(",
      "set(",
      "abs(",
      "max(",
      "min(",
      "sum(",
      "sorted(",
      "reversed(",
      "enumerate(",
      "zip(",
      "all(",
      "any(",
      "bool(",
      "round(",
      "pow(",
      "divmod(",
      "ord(",
      "chr(",
      "bin(",
      "oct(",
      "hex(",
      "format(",
    ];
    return builtinFunctions.some((func) => line.includes(func));
  }

  private handleBuiltinFunction(line: string) {
    // Manejar len()
    if (line.includes("len(")) {
      const match = line.match(/len\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        if (typeof arg === "string" || Array.isArray(arg)) {
          this.output.push(String(arg.length));
        } else if (typeof arg === "object" && arg !== null) {
          this.output.push(String(Object.keys(arg).length));
        } else {
          throw new Error(`len() no se puede aplicar a tipo ${typeof arg}`);
        }
      }
      return;
    }

    // Manejar str()
    if (line.includes("str(")) {
      const match = line.match(/str\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        this.output.push(String(arg));
      }
      return;
    }

    // Manejar int()
    if (line.includes("int(")) {
      const match = line.match(/int\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        const result = parseInt(String(arg), 10);
        if (isNaN(result)) {
          throw new Error(`No se puede convertir '${arg}' a entero`);
        }
        this.output.push(String(result));
      }
      return;
    }

    // Manejar float()
    if (line.includes("float(")) {
      const match = line.match(/float\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        const result = parseFloat(String(arg));
        if (isNaN(result)) {
          throw new Error(`No se puede convertir '${arg}' a flotante`);
        }
        this.output.push(String(result));
      }
      return;
    }

    // Manejar bool()
    if (line.includes("bool(")) {
      const match = line.match(/bool\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        const result = Boolean(arg);
        this.output.push(String(result));
      }
      return;
    }

    // Manejar list()
    if (line.includes("list(")) {
      const match = line.match(/list\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        if (typeof arg === "string") {
          this.output.push(JSON.stringify([...arg]));
        } else if (Array.isArray(arg)) {
          this.output.push(JSON.stringify(arg));
        } else {
          this.output.push("[]");
        }
      }
      return;
    }

    // Manejar abs()
    if (line.includes("abs(")) {
      const match = line.match(/abs\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        if (typeof arg === "number") {
          this.output.push(String(Math.abs(arg)));
        } else {
          throw new Error(`abs() requiere un número`);
        }
      }
      return;
    }

    // Manejar max()
    if (line.includes("max(")) {
      const match = line.match(/max\s*\((.*)\)/);
      if (match) {
        const args = this.parseArguments(match[1].trim());
        const values = args.map((arg) => this.evaluateExpression(arg));
        if (values.length === 1 && Array.isArray(values[0])) {
          this.output.push(String(Math.max(...values[0])));
        } else {
          this.output.push(String(Math.max(...values)));
        }
      }
      return;
    }

    // Manejar min()
    if (line.includes("min(")) {
      const match = line.match(/min\s*\((.*)\)/);
      if (match) {
        const args = this.parseArguments(match[1].trim());
        const values = args.map((arg) => this.evaluateExpression(arg));
        if (values.length === 1 && Array.isArray(values[0])) {
          this.output.push(String(Math.min(...values[0])));
        } else {
          this.output.push(String(Math.min(...values)));
        }
      }
      return;
    }

    // Manejar sum()
    if (line.includes("sum(")) {
      const match = line.match(/sum\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        if (Array.isArray(arg)) {
          const result = arg.reduce(
            (acc, val) => acc + (typeof val === "number" ? val : 0),
            0
          );
          this.output.push(String(result));
        } else {
          throw new Error(`sum() requiere una lista`);
        }
      }
      return;
    }

    // Manejar sorted()
    if (line.includes("sorted(")) {
      const match = line.match(/sorted\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        if (Array.isArray(arg)) {
          const sorted = [...arg].sort((a, b) => {
            if (typeof a === "number" && typeof b === "number") return a - b;
            return String(a).localeCompare(String(b));
          });
          this.output.push(JSON.stringify(sorted));
        } else {
          throw new Error(`sorted() requiere una lista`);
        }
      }
      return;
    }

    // Manejar round()
    if (line.includes("round(")) {
      const match = line.match(/round\s*\((.*)\)/);
      if (match) {
        const args = this.parseArguments(match[1].trim());
        const number = this.evaluateExpression(args[0]);
        const digits = args[1] ? this.evaluateExpression(args[1]) : 0;
        if (typeof number === "number") {
          this.output.push(
            String(
              Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits)
            )
          );
        } else {
          throw new Error(`round() requiere un número`);
        }
      }
      return;
    }

    // Manejar type()
    if (line.includes("type(")) {
      const match = line.match(/type\s*\((.*)\)/);
      if (match) {
        const arg = this.evaluateExpression(match[1].trim());
        let pythonType = "";
        if (typeof arg === "string") pythonType = "<class 'str'>";
        else if (typeof arg === "number" && Number.isInteger(arg))
          pythonType = "<class 'int'>";
        else if (typeof arg === "number") pythonType = "<class 'float'>";
        else if (typeof arg === "boolean") pythonType = "<class 'bool'>";
        else if (Array.isArray(arg)) pythonType = "<class 'list'>";
        else if (arg === null) pythonType = "<class 'NoneType'>";
        else if (typeof arg === "object") pythonType = "<class 'dict'>";
        else pythonType = `<class '${typeof arg}'>`;
        this.output.push(pythonType);
      }
      return;
    }
  }

  private evaluateTernaryExpression(expr: string): any {
    // Parseear expresión ternaria: "valor_si_true if condicion else valor_si_false"
    const ifIndex = expr.indexOf(" if ");
    const elseIndex = expr.lastIndexOf(" else ");

    if (ifIndex === -1 || elseIndex === -1 || ifIndex >= elseIndex) {
      throw new Error(`Expresión ternaria mal formada: ${expr}`);
    }

    const valueIfTrue = expr.substring(0, ifIndex).trim();
    const condition = expr.substring(ifIndex + 4, elseIndex).trim();
    const valueIfFalse = expr.substring(elseIndex + 5).trim();

    // Evaluar la condición
    const conditionResult = this.evaluateExpression(condition);

    // Retornar el valor correspondiente basado en la condición
    if (conditionResult) {
      return this.evaluateExpression(valueIfTrue);
    } else {
      return this.evaluateExpression(valueIfFalse);
    }
  }

  // Métodos adicionales para estructuras de datos
  private evaluateDictionary(expr: string): object {
    const content = expr.slice(1, -1).trim();
    if (content === "") return {};

    const dict: any = {};
    const pairs = this.parseArguments(content);

    for (const pair of pairs) {
      if (pair.includes(":")) {
        const [key, value] = pair.split(":").map((p) => p.trim());
        const evalKey = this.evaluateExpression(key);
        const evalValue = this.evaluateExpression(value);
        dict[evalKey] = evalValue;
      }
    }

    return dict;
  }

  private evaluateTuple(expr: string): any[] {
    const content = expr.slice(1, -1).trim();
    if (content === "") return [];

    const elements = this.parseArguments(content);
    return elements.map((element) => this.evaluateExpression(element));
  }

  private evaluateLogicalExpression(expr: string): boolean {
    if (expr.startsWith("not ")) {
      const operand = expr.substring(4).trim();
      return !this.evaluateExpression(operand);
    }

    if (expr.includes(" and ")) {
      const parts = expr.split(" and ");
      return parts.every((part) => this.evaluateExpression(part.trim()));
    }

    if (expr.includes(" or ")) {
      const parts = expr.split(" or ");
      return parts.some((part) => this.evaluateExpression(part.trim()));
    }

    return Boolean(this.evaluateExpression(expr));
  }

  private evaluateMembershipExpression(expr: string): boolean {
    if (expr.includes(" not in ")) {
      const [left, right] = expr.split(" not in ").map((p) => p.trim());
      const leftVal = this.evaluateExpression(left);
      const rightVal = this.evaluateExpression(right);

      if (typeof rightVal === "string") {
        return !rightVal.includes(String(leftVal));
      } else if (Array.isArray(rightVal)) {
        return !rightVal.includes(leftVal);
      }
      return false;
    }

    if (expr.includes(" in ")) {
      const [left, right] = expr.split(" in ").map((p) => p.trim());
      const leftVal = this.evaluateExpression(left);
      const rightVal = this.evaluateExpression(right);

      if (typeof rightVal === "string") {
        return rightVal.includes(String(leftVal));
      } else if (Array.isArray(rightVal)) {
        return rightVal.includes(leftVal);
      } else if (typeof rightVal === "object" && rightVal !== null) {
        return leftVal in rightVal;
      }
      return false;
    }

    return false;
  }

  private evaluateIndexAccess(expr: string): any {
    const bracketIndex = expr.indexOf("[");
    const closeBracketIndex = expr.lastIndexOf("]");

    if (bracketIndex === -1 || closeBracketIndex === -1) return expr;

    const objectExpr = expr.substring(0, bracketIndex);
    const indexExpr = expr.substring(bracketIndex + 1, closeBracketIndex);

    const object = this.evaluateExpression(objectExpr);
    const index = this.evaluateExpression(indexExpr);

    if (Array.isArray(object)) {
      if (typeof index === "number") {
        const actualIndex = index < 0 ? object.length + index : index;
        return object[actualIndex];
      }
    } else if (typeof object === "string") {
      if (typeof index === "number") {
        const actualIndex = index < 0 ? object.length + index : index;
        return object[actualIndex];
      }
    } else if (typeof object === "object" && object !== null) {
      return (object as any)[index];
    }

    return undefined;
  }

  private evaluateAttributeAccess(expr: string): any {
    const dotIndex = expr.indexOf(".");
    if (dotIndex === -1) return expr;

    const objectExpr = expr.substring(0, dotIndex);
    const attributeName = expr.substring(dotIndex + 1);

    const object = this.evaluateExpression(objectExpr);

    if (typeof object === "object" && object !== null) {
      // Métodos de string
      if (typeof object === "string") {
        switch (attributeName) {
          case "upper()":
            return object.toUpperCase();
          case "lower()":
            return object.toLowerCase();
          case "strip()":
            return object.trim();
          case "split()":
            return object.split(" ");
          default:
            if (attributeName.startsWith("split(")) {
              const match = attributeName.match(/split\(['"]([^'"]*)['"]\)/);
              return match ? object.split(match[1]) : object.split(" ");
            }
            break;
        }
      }

      // Métodos de lista
      if (Array.isArray(object)) {
        switch (attributeName) {
          case "reverse()":
            object.reverse();
            return object;
          case "sort()":
            object.sort();
            return object;
          default:
            if (attributeName.startsWith("append(")) {
              const match = attributeName.match(/append\((.*)\)/);
              if (match) {
                const value = this.evaluateExpression(match[1]);
                object.push(value);
                return object;
              }
            }
            break;
        }
      }

      return (object as any)[attributeName];
    }

    return undefined;
  }
}
