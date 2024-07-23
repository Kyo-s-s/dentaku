const sanitizeLine = (line: string): string => {
  return line.replace(/\s/g, "");
};

class Parser {
  line: string = "";
  pos: number = 0;
  variableDict: { [key: string]: number } = {};
  functionDict: { [key: string]: () => number } = {
    set: () => this.set(),
    sum: () => this.sum(),
    sqrt: () => this.sqrt(),
  };

  constructor() {
    this.variableDict = {};
  }

  eos(): boolean {
    return this.pos >= this.line.length;
  }

  peek(): string {
    return this.line[this.pos];
  }

  read(): string {
    return this.line[this.pos++];
  }

  consume(str: string): boolean {
    if (this.line.slice(this.pos, this.pos + str.length) === str) {
      this.pos += str.length;
      return true;
    }
    return false;
  }

  parse(line: string): string {
    this.line = sanitizeLine(line);
    this.pos = 0;
    try {
      return this.expr().toString();
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }
      return "error!!";
    }
  }

  expr(): number {
    let value = this.term();
    while (!this.eos() && this.peek() != ")") {
      if (this.consume("+")) {
        value += this.term();
      } else if (this.consume("-")) {
        value -= this.term();
      } else {
        throw new Error("invalid syntax: expr");
      }
    }
    return value;
  }

  term(): number {
    let value = this.factor();
    while (!this.eos() && !["+", "-", ")"].includes(this.peek())) {
      if (this.consume("*")) {
        value *= this.factor();
      } else if (this.consume("/")) {
        value /= this.factor();
      } else if (this.consume("^")) {
        value **= this.factor();
      } else {
        value *= this.factor();
      }
    }
    return value;
  }

  factor(): number {
    if (this.consume("(")) {
      const value = this.expr();
      if (!this.consume(")")) {
        throw new Error("invalid syntax: factor");
      }
      return value;
    }
    for (const key in this.functionDict) {
      if (this.consume(key)) {
        this.consume("(");
        const res = this.functionDict[key]();
        this.consume(")");
        return res;
      }
    }
    if (/[a-z]/.test(this.peek())) {
      return this.variable();
    }
    return this.number();
  }

  number(): number {
    let value = "";
    while (!this.eos() && /[\d.]/.test(this.peek())) {
      value += this.read();
    }
    return parseFloat(value);
  }

  variable(): number {
    const key = this.read();
    const res = this.variableDict[key];
    if (res == null) {
      throw new Error(`undefined variable: ${key}`);
    }
    return res;
  }

  set(): number {
    const key = this.read();
    if (!this.consume(",")) {
      console.log(this.peek());
      throw new Error("invalid syntax: set");
    }
    const value = this.expr();
    this.variableDict[key] = value;
    return value;
  }

  sum(): number {
    const key = this.read();
    if (!this.consume(",")) {
      throw new Error("invalid syntax: sum");
    }
    const start = this.number();
    if (!this.consume(",")) {
      throw new Error("invalid syntax: sum");
    }
    const end = this.number();
    if (!this.consume(",")) {
      throw new Error("invalid syntax: sum");
    }
    const pos = this.pos;
    let sum = 0;
    for (let v = start; v <= end; v++) {
      this.pos = pos;
      this.variableDict[key] = v;
      sum += this.expr();
    }
    return sum;
  }

  sqrt(): number {
    const value = this.expr();
    return Math.sqrt(value);
  }
}

const solve = (input: string): string => {
  const parser = new Parser();
  return input
    .split("\n")
    .map((line) => parser.parse(line))
    .join("\n");
};

export default solve;
