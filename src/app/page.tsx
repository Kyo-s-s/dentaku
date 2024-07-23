"use client";

import solve from "@/utils/dentaku";
import { useState } from "react";

const HowToUse = () => {
  const bnf = `
<expr>     ::= <term> [ ('+' | '-') <term> ]*
<term>     ::= <factor> [ ('*' | '/' | '^' | '') <factor> ]*
<factor>   ::= '(' <expr> ')' | <number> | <variable> | <function>
<function> ::= <func-name> '(' <expr> [ , <expr>]* ')'
<number>   ::= \d+(\.\d+)?
<variable> ::= [a-z]
  `;

  return (
    <>
      <p>
        各行 <code>{`<expr>`}</code>を改行区切りで記述する。
      </p>
      <p>
        変数宣言は <code>{`set(<variable>, <number>)`}</code> で行う。
      </p>
      <pre>{bnf}</pre>
      <p>例</p>
      <pre>{`
set(a, 1) 
set(b, 2)
a + b
sum(x, 1, 10, x)
      `}</pre>
      <p>function は以下が使用可能。</p>
      <pre>{`
set(<variable>, <expr>) // 変数宣言 <variable> に <expr> を代入
sqrt(<expr>) // 平方根
sum(<variable>, <integer>, <integer>, <expr>) // <variable> を <integer> から <integer> までの範囲で <expr> を計算した総和
      `}</pre>
    </>
  );
};

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = () => {
    setResult(solve(input));
  };

  return (
    <>
      <HowToUse />
      <textarea
        cols={50}
        rows={10}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleClick}>実行</button>
      {result && <pre>{result}</pre>}
    </>
  );
}
