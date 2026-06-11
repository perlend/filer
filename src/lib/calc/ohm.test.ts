import { describe, expect, it } from "vitest";
import { losOhm } from "./ohm";

describe("losOhm", () => {
  // Håndregnet: U=230 V, R=23 Ω → I = 230/23 = 10 A, P = 230·10 = 2300 W
  it("U=230 V og R=23 Ω gir I=10 A og P=2300 W", () => {
    const res = losOhm({ u: 230, r: 23 });
    expect(res.i).toBeCloseTo(10);
    expect(res.p).toBeCloseTo(2300);
  });

  // Håndregnet: P=2000 W, U=230 V → I = 2000/230 = 8,6957 A, R = 230/8,6957 = 26,45 Ω
  it("varmeovn 2000 W på 230 V trekker 8,70 A", () => {
    const res = losOhm({ p: 2000, u: 230 });
    expect(res.i).toBeCloseTo(8.6957, 3);
    expect(res.r).toBeCloseTo(26.45, 2);
  });

  // Håndregnet: P=2300 W, R=23 Ω → I = √(2300/23) = √100 = 10 A, U = 230 V
  it("P og R gir riktig U og I", () => {
    const res = losOhm({ p: 2300, r: 23 });
    expect(res.i).toBeCloseTo(10);
    expect(res.u).toBeCloseTo(230);
  });

  it("U=230 V og I=10 A gir R=23 Ω", () => {
    const res = losOhm({ u: 230, i: 10 });
    expect(res.r).toBeCloseTo(23);
    expect(res.p).toBeCloseTo(2300);
  });

  it("I=10 A og R=23 Ω gir U=230 V", () => {
    const res = losOhm({ i: 10, r: 23 });
    expect(res.u).toBeCloseTo(230);
  });

  it("I og P gir riktig U", () => {
    const res = losOhm({ i: 10, p: 2300 });
    expect(res.u).toBeCloseTo(230);
    expect(res.r).toBeCloseTo(23);
  });

  it("kaster feil med færre enn to størrelser", () => {
    expect(() => losOhm({ u: 230 })).toThrow(/nøyaktig to/);
  });

  it("kaster feil med flere enn to størrelser", () => {
    expect(() => losOhm({ u: 230, i: 10, r: 23 })).toThrow(/nøyaktig to/);
  });

  it("kaster feil ved null og negative verdier", () => {
    expect(() => losOhm({ u: 0, i: 10 })).toThrow(/positivt/);
    expect(() => losOhm({ u: 230, i: -5 })).toThrow(/positivt/);
  });
});
