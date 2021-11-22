interface bit {
	bdiv(dividend: number, divisor: number): number;
	badd(a: number, b: number): number;
	bsub(a: number, b: number): number;
	bmul(a: number, b: number): number;
	band(val: number, by: number): number;
	bor(val: number, by: number): number;
	bxor(val: number, by: number): number;
	bnot(val: number): number;
	bswap(val: number): number;
	ror(value: number, rotate_count: number): number;
	rol(value: number, rotate_count: number): number;
	tohex(val: number): string;
	tobit(val: number): number;
	lshift(val: number, by: number): number;
	rshift(val: number, by: number): number;
	arshift(val: number, shift_count: number): number;
}
declare const bit: bit;
