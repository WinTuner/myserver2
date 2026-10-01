function hello() {
    console.log("Hello, world!");
}

function add(a: number, b: number): number {
    return a + b;
}

function multiply(a: number, b: number): number {
    return a * b;
}

export const Utils = {
    hello,
    add,
    multiply,
};