var __toBinary = /* @__PURE__ */ (() => {
  var table = new Uint8Array(128);
  for (var i = 0; i < 64; i++) table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
  return (base64) => {
    var n = base64.length, bytes = new Uint8Array((n - (base64[n - 1] == "=") - (base64[n - 2] == "=")) * 3 / 4 | 0);
    for (var i2 = 0, j = 0; i2 < n; ) {
      var c0 = table[base64.charCodeAt(i2++)], c12 = table[base64.charCodeAt(i2++)];
      var c22 = table[base64.charCodeAt(i2++)], c32 = table[base64.charCodeAt(i2++)];
      bytes[j++] = c0 << 2 | c12 >> 4;
      bytes[j++] = c12 << 4 | c22 >> 2;
      bytes[j++] = c22 << 6 | c32;
    }
    return bytes;
  };
})();

// src/math/color.ts
var Color = class _Color {
  /** Red (0-255. */
  r = 255;
  /** Green (0-255). */
  g = 255;
  /** Blue (0-255). */
  b = 255;
  constructor(r, g, b) {
    this.r = clamp(r, 0, 255);
    this.g = clamp(g, 0, 255);
    this.b = clamp(b, 0, 255);
  }
  // TODO: Type arr as tuple (no in ts-strict branch yet)
  static fromArray(arr) {
    return new _Color(arr[0], arr[1], arr[2]);
  }
  /**
   * Create color from hex string or literal.
   *
   * @example
   * ```js
   * Color.fromHex(0xfcef8d)
   * Color.fromHex("#5ba675")
   * Color.fromHex("d46eb3")
   * ```
   *
   * @since v3000.0
   */
  static fromHex(hex) {
    if (typeof hex === "number") {
      return new _Color(
        hex >> 16 & 255,
        hex >> 8 & 255,
        hex >> 0 & 255
      );
    } else if (typeof hex === "string") {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        hex
      );
      if (!result) throw new Error("Invalid hex color format");
      return new _Color(
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      );
    } else {
      throw new Error("Invalid hex color format");
    }
  }
  // TODO: use range of [0, 360] [0, 100] [0, 100]?
  static fromHSL(h, s, l) {
    if (s == 0) {
      return new _Color(255 * l, 255 * l, 255 * l);
    }
    const hue2rgb = (p2, q2, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
      if (t < 1 / 2) return q2;
      if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
      return p2;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);
    return new _Color(
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    );
  }
  static RED = new _Color(255, 0, 0);
  static GREEN = new _Color(0, 255, 0);
  static BLUE = new _Color(0, 0, 255);
  static YELLOW = new _Color(255, 255, 0);
  static MAGENTA = new _Color(255, 0, 255);
  static CYAN = new _Color(0, 255, 255);
  static WHITE = new _Color(255, 255, 255);
  static BLACK = new _Color(0, 0, 0);
  clone() {
    return new _Color(this.r, this.g, this.b);
  }
  /** Lighten the color (adds RGB by n). */
  lighten(a) {
    return new _Color(this.r + a, this.g + a, this.b + a);
  }
  /** Darkens the color (subtracts RGB by n). */
  darken(a) {
    return this.lighten(-a);
  }
  invert() {
    return new _Color(255 - this.r, 255 - this.g, 255 - this.b);
  }
  mult(other) {
    return new _Color(
      this.r * other.r / 255,
      this.g * other.g / 255,
      this.b * other.b / 255
    );
  }
  /**
   * Linear interpolate to a destination color.
   *
   * @since v3000.0
   */
  lerp(dest, t) {
    return new _Color(
      lerp(this.r, dest.r, t),
      lerp(this.g, dest.g, t),
      lerp(this.b, dest.b, t)
    );
  }
  /**
   * Convert color into HSL format.
   *
   * @since v3001.0
   */
  toHSL() {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = (max + min) / 2;
    let s = h;
    const l = h;
    if (max == min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
  eq(other) {
    return this.r === other.r && this.g === other.g && this.b === other.b;
  }
  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
  /**
   * Return the hex string of color.
   *
   * @since v3000.0
   */
  toHex() {
    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
  }
  /**
   * Return the color converted to an array.
   *
   * @since v3001.0
   */
  toArray() {
    return [this.r, this.g, this.b];
  }
};
function rgb(...args) {
  if (args.length === 0) {
    return new Color(255, 255, 255);
  } else if (args.length === 1) {
    if (args[0] instanceof Color) {
      return args[0].clone();
    } else if (typeof args[0] === "string") {
      return Color.fromHex(args[0]);
    } else if (Array.isArray(args[0]) && args[0].length === 3) {
      return Color.fromArray(args[0]);
    }
  } else if (args.length === 2) {
    if (args[0] instanceof Color) {
      return args[0].clone();
    }
  } else if (args.length === 3 || args.length === 4) {
    return new Color(args[0], args[1], args[2]);
  }
  throw new Error("Invalid color arguments");
}
var hsl2rgb = (h, s, l) => Color.fromHSL(h, s, l);

// src/math/math.ts
function deg2rad(deg) {
  return deg * Math.PI / 180;
}
function rad2deg(rad) {
  return rad * 180 / Math.PI;
}
function clamp(val, min, max) {
  if (min > max) {
    return clamp(val, max, min);
  }
  return Math.min(Math.max(val, min), max);
}
function lerp(a, b, t) {
  if (typeof a === "number" && typeof b === "number") {
    return a + (b - a) * t;
  } else if (a instanceof Vec2 && b instanceof Vec2) {
    return a.lerp(b, t);
  } else if (a instanceof Color && b instanceof Color) {
    return a.lerp(b, t);
  }
  throw new Error(
    `Bad value for lerp(): ${a}, ${b}. Only number, Vec2 and Color is supported.`
  );
}
function map(v, l1, h1, l2, h2) {
  return l2 + (v - l1) / (h1 - l1) * (h2 - l2);
}
function mapc(v, l1, h1, l2, h2) {
  return clamp(map(v, l1, h1, l2, h2), l2, h2);
}
var Vec2 = class _Vec2 {
  /** The x coordinate */
  x = 0;
  /** The y coordinate */
  y = 0;
  constructor(x = 0, y = x) {
    this.x = x;
    this.y = y;
  }
  /** Create a new Vec2 from an angle in degrees */
  static fromAngle(deg) {
    const angle = deg2rad(deg);
    return new _Vec2(Math.cos(angle), Math.sin(angle));
  }
  /** Create a new Vec2 from an array */
  static fromArray(arr) {
    return new _Vec2(arr[0], arr[1]);
  }
  static LEFT = new _Vec2(-1, 0);
  static RIGHT = new _Vec2(1, 0);
  static UP = new _Vec2(0, -1);
  static DOWN = new _Vec2(0, 1);
  /** Clone the vector */
  clone() {
    return new _Vec2(this.x, this.y);
  }
  /** Returns the addition with another vector. */
  add(...args) {
    const p2 = vec2(...args);
    return new _Vec2(this.x + p2.x, this.y + p2.y);
  }
  /** Returns the subtraction with another vector. */
  sub(...args) {
    const p2 = vec2(...args);
    return new _Vec2(this.x - p2.x, this.y - p2.y);
  }
  /** Scale by another vector. or a single number */
  scale(...args) {
    const s = vec2(...args);
    return new _Vec2(this.x * s.x, this.y * s.y);
  }
  /** Get distance between another vector */
  dist(...args) {
    const p2 = vec2(...args);
    return this.sub(p2).len();
  }
  /** Get squared distance between another vector */
  sdist(...args) {
    const p2 = vec2(...args);
    return this.sub(p2).slen();
  }
  len() {
    return Math.sqrt(this.dot(this));
  }
  /**
   * Get squared length of the vector
   *
   * @since v3000.0
   */
  slen() {
    return this.dot(this);
  }
  /**
   * Get the unit vector (length of 1).
   */
  unit() {
    const len = this.len();
    return len === 0 ? new _Vec2(0) : this.scale(1 / len);
  }
  /**
   * Get the perpendicular vector.
   */
  normal() {
    return new _Vec2(this.y, -this.x);
  }
  /**
   * Get the reflection of a vector with a normal.
   *
   * @since v3000.0
   */
  reflect(normal) {
    return this.sub(normal.scale(2 * this.dot(normal)));
  }
  /**
   * Get the projection of a vector onto another vector.
   *
   * @since v3000.0
   */
  project(on2) {
    return on2.scale(on2.dot(this) / on2.len());
  }
  /**
   * Get the rejection of a vector onto another vector.
   *
   * @since v3000.0
   */
  reject(on2) {
    return this.sub(this.project(on2));
  }
  /**
   * Get the dot product with another vector.
   */
  dot(p2) {
    return this.x * p2.x + this.y * p2.y;
  }
  /**
   * Get the cross product with another vector.
   *
   * @since v3000.0
   */
  cross(p2) {
    return this.x * p2.y - this.y * p2.x;
  }
  /**
   * Get the angle of the vector in degrees.
   */
  angle(...args) {
    const p2 = vec2(...args);
    return rad2deg(Math.atan2(this.y - p2.y, this.x - p2.x));
  }
  /**
   * Get the angle between this vector and another vector.
   *
   * @since v3000.0
   */
  angleBetween(...args) {
    const p2 = vec2(...args);
    return rad2deg(Math.atan2(this.cross(p2), this.dot(p2)));
  }
  /**
   * Linear interpolate to a destination vector (for positions).
   */
  lerp(dest, t) {
    return new _Vec2(lerp(this.x, dest.x, t), lerp(this.y, dest.y, t));
  }
  /**
   * Spherical linear interpolate to a destination vector (for rotations).
   *
   * @since v3000.0
   */
  slerp(dest, t) {
    const cos = this.dot(dest);
    const sin = this.cross(dest);
    const angle = Math.atan2(sin, cos);
    return this.scale(Math.sin((1 - t) * angle)).add(dest.scale(Math.sin(t * angle))).scale(1 / sin);
  }
  /**
   * If the vector (x, y) is zero.
   *
   * @since v3000.0
   */
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  /**
   * To n precision floating point.
   */
  toFixed(n) {
    return new _Vec2(Number(this.x.toFixed(n)), Number(this.y.toFixed(n)));
  }
  /**
   * Multiply by a Mat4.
   *
   * @since v3000.0
   */
  transform(m) {
    return m.multVec2(this);
  }
  eq(other) {
    return this.x === other.x && this.y === other.y;
  }
  bbox() {
    return new Rect(this, 0, 0);
  }
  toString() {
    return `vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }
  toArray() {
    return [this.x, this.y];
  }
};
function vec2(...args) {
  if (args.length === 1) {
    if (args[0] instanceof Vec2) {
      return new Vec2(args[0].x, args[0].y);
    } else if (Array.isArray(args[0]) && args[0].length === 2) {
      return new Vec2(...args[0]);
    }
  }
  return new Vec2(...args);
}
var Quad = class _Quad {
  x = 0;
  y = 0;
  w = 1;
  h = 1;
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  scale(other) {
    return new _Quad(
      this.x + this.w * other.x,
      this.y + this.h * other.y,
      this.w * other.w,
      this.h * other.h
    );
  }
  pos() {
    return new Vec2(this.x, this.y);
  }
  clone() {
    return new _Quad(this.x, this.y, this.w, this.h);
  }
  eq(other) {
    return this.x === other.x && this.y === other.y && this.w === other.w && this.h === other.h;
  }
  toString() {
    return `quad(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
  }
};
function quad(x, y, w, h) {
  return new Quad(x, y, w, h);
}
var Mat2 = class _Mat2 {
  // 2x2 matrix
  a;
  b;
  c;
  d;
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }
  mul(other) {
    return new _Mat2(
      this.a * other.a + this.b * other.c,
      this.a * other.b + this.b * other.d,
      this.c * other.a + this.d * other.c,
      this.c * other.b + this.d * other.d
    );
  }
  transform(point) {
    return vec2(
      this.a * point.x + this.b * point.y,
      this.c * point.x + this.d * point.y
    );
  }
  get inverse() {
    const det = this.det;
    return new _Mat2(
      this.d / det,
      -this.b / det,
      -this.c / det,
      this.a / det
    );
  }
  get transpose() {
    return new _Mat2(
      this.a,
      this.c,
      this.b,
      this.d
    );
  }
  get eigenvalues() {
    const m = this.trace / 2;
    const d = this.det;
    const e1 = m + Math.sqrt(m * m - d);
    const e2 = m - Math.sqrt(m * m - d);
    return [e1, e2];
  }
  eigenvectors(e1, e2) {
    if (this.c != 0) {
      return [[e1 - this.d, this.c], [e2 - this.d, this.c]];
    } else if (this.b != 0) {
      return [[this.b, e1 - this.a], [this.b, e2 - this.a]];
    } else {
      if (Math.abs(this.transform(vec2(1, 0)).x - e1) < Number.EPSILON) {
        return [[1, 0], [0, 1]];
      } else {
        return [[0, 1], [1, 0]];
      }
    }
  }
  get det() {
    return this.a * this.d - this.b * this.c;
  }
  get trace() {
    return this.a + this.d;
  }
  static rotation(radians) {
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    return new _Mat2(
      c,
      s,
      -s,
      c
    );
  }
  static scale(x, y) {
    return new _Mat2(x, 0, 0, y);
  }
};
var Mat3 = class _Mat3 {
  // m11 m12 m13
  // m21 m22 m23
  // m31 m32 m33
  m11;
  m12;
  m13;
  m21;
  m22;
  m23;
  m31;
  m32;
  m33;
  constructor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
    this.m11 = m11;
    this.m12 = m12;
    this.m13 = m13;
    this.m21 = m21;
    this.m22 = m22;
    this.m23 = m23;
    this.m31 = m31;
    this.m32 = m32;
    this.m33 = m33;
  }
  static fromMat2(m) {
    return new _Mat3(
      m.a,
      m.b,
      0,
      m.c,
      m.d,
      0,
      0,
      0,
      1
    );
  }
  toMat2() {
    return new Mat2(
      this.m11,
      this.m12,
      this.m21,
      this.m22
    );
  }
  mul(other) {
    return new _Mat3(
      this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31,
      this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32,
      this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33,
      this.m21 * other.m11 + this.m22 * other.m21 + this.m23 * other.m31,
      this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32,
      this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33,
      this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31,
      this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32,
      this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33
    );
  }
  get det() {
    return this.m11 * this.m22 * this.m33 + this.m12 * this.m23 * this.m31 + this.m13 * this.m21 * this.m32 - this.m13 * this.m22 * this.m31 - this.m12 * this.m21 * this.m33 - this.m11 * this.m23 * this.m32;
  }
  rotate(radians) {
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    const oldA = this.m11;
    const oldB = this.m12;
    this.m11 = c * this.m11 + s * this.m21;
    this.m12 = c * this.m12 + s * this.m22;
    this.m21 = c * this.m21 - s * oldA;
    this.m22 = c * this.m22 - s * oldB;
    return this;
  }
  scale(x, y) {
    this.m11 *= x;
    this.m12 *= x;
    this.m21 *= y;
    this.m22 *= y;
    return this;
  }
  get inverse() {
    const det = this.det;
    return new _Mat3(
      (this.m22 * this.m33 - this.m23 * this.m32) / det,
      (this.m13 * this.m32 - this.m12 * this.m33) / det,
      (this.m12 * this.m23 - this.m13 * this.m22) / det,
      (this.m23 * this.m31 - this.m21 * this.m33) / det,
      (this.m11 * this.m33 - this.m13 * this.m31) / det,
      (this.m13 * this.m21 - this.m11 * this.m23) / det,
      (this.m21 * this.m32 - this.m22 * this.m31) / det,
      (this.m12 * this.m31 - this.m11 * this.m32) / det,
      (this.m11 * this.m22 - this.m12 * this.m21) / det
    );
  }
  get transpose() {
    return new _Mat3(
      this.m11,
      this.m21,
      this.m31,
      this.m12,
      this.m22,
      this.m32,
      this.m13,
      this.m23,
      this.m33
    );
  }
};
var Mat4 = class _Mat4 {
  m = [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ];
  constructor(m) {
    if (m) {
      this.m = m;
    }
  }
  static translate(p) {
    return new _Mat4([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      p.x,
      p.y,
      0,
      1
    ]);
  }
  static scale(s) {
    return new _Mat4([
      s.x,
      0,
      0,
      0,
      0,
      s.y,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
  }
  static rotateX(a) {
    a = deg2rad(-a);
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new _Mat4([
      1,
      0,
      0,
      0,
      0,
      c,
      -s,
      0,
      0,
      s,
      c,
      0,
      0,
      0,
      0,
      1
    ]);
  }
  static rotateY(a) {
    a = deg2rad(-a);
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new _Mat4([
      c,
      0,
      s,
      0,
      0,
      1,
      0,
      0,
      -s,
      0,
      c,
      0,
      0,
      0,
      0,
      1
    ]);
  }
  static rotateZ(a) {
    a = deg2rad(-a);
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new _Mat4([
      c,
      -s,
      0,
      0,
      s,
      c,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
  }
  translate(p) {
    this.m[12] += this.m[0] * p.x + this.m[4] * p.y;
    this.m[13] += this.m[1] * p.x + this.m[5] * p.y;
    this.m[14] += this.m[2] * p.x + this.m[6] * p.y;
    this.m[15] += this.m[3] * p.x + this.m[7] * p.y;
    return this;
  }
  scale(p) {
    this.m[0] *= p.x;
    this.m[4] *= p.y;
    this.m[1] *= p.x;
    this.m[5] *= p.y;
    this.m[2] *= p.x;
    this.m[6] *= p.y;
    this.m[3] *= p.x;
    this.m[7] *= p.y;
    return this;
  }
  rotate(a) {
    a = deg2rad(-a);
    const c = Math.cos(a);
    const s = Math.sin(a);
    const m0 = this.m[0];
    const m1 = this.m[1];
    const m4 = this.m[4];
    const m5 = this.m[5];
    this.m[0] = m0 * c + m1 * s;
    this.m[1] = -m0 * s + m1 * c;
    this.m[4] = m4 * c + m5 * s;
    this.m[5] = -m4 * s + m5 * c;
    return this;
  }
  // TODO: in-place variant
  mult(other) {
    const out = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[i * 4 + j] = this.m[0 * 4 + j] * other.m[i * 4 + 0] + this.m[1 * 4 + j] * other.m[i * 4 + 1] + this.m[2 * 4 + j] * other.m[i * 4 + 2] + this.m[3 * 4 + j] * other.m[i * 4 + 3];
      }
    }
    return new _Mat4(out);
  }
  multVec2(p) {
    return new Vec2(
      p.x * this.m[0] + p.y * this.m[4] + this.m[12],
      p.x * this.m[1] + p.y * this.m[5] + this.m[13]
    );
  }
  getTranslation() {
    return new Vec2(this.m[12], this.m[13]);
  }
  getScale() {
    if (this.m[0] != 0 || this.m[1] != 0) {
      const det = this.m[0] * this.m[5] - this.m[1] * this.m[4];
      const r = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
      return new Vec2(r, det / r);
    } else if (this.m[4] != 0 || this.m[5] != 0) {
      const det = this.m[0] * this.m[5] - this.m[1] * this.m[4];
      const s = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
      return new Vec2(det / s, s);
    } else {
      return new Vec2(0, 0);
    }
  }
  getRotation() {
    if (this.m[0] != 0 || this.m[1] != 0) {
      const r = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
      return rad2deg(
        this.m[1] > 0 ? Math.acos(this.m[0] / r) : -Math.acos(this.m[0] / r)
      );
    } else if (this.m[4] != 0 || this.m[5] != 0) {
      const s = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
      return rad2deg(
        Math.PI / 2 - (this.m[5] > 0 ? Math.acos(-this.m[4] / s) : -Math.acos(this.m[4] / s))
      );
    } else {
      return 0;
    }
  }
  getSkew() {
    if (this.m[0] != 0 || this.m[1] != 0) {
      const r = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
      return new Vec2(
        Math.atan(this.m[0] * this.m[4] + this.m[1] * this.m[5]) / (r * r),
        0
      );
    } else if (this.m[4] != 0 || this.m[5] != 0) {
      const s = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
      return new Vec2(
        0,
        Math.atan(this.m[0] * this.m[4] + this.m[1] * this.m[5]) / (s * s)
      );
    } else {
      return new Vec2(0, 0);
    }
  }
  invert() {
    const out = [];
    const f00 = this.m[10] * this.m[15] - this.m[14] * this.m[11];
    const f01 = this.m[9] * this.m[15] - this.m[13] * this.m[11];
    const f02 = this.m[9] * this.m[14] - this.m[13] * this.m[10];
    const f03 = this.m[8] * this.m[15] - this.m[12] * this.m[11];
    const f04 = this.m[8] * this.m[14] - this.m[12] * this.m[10];
    const f05 = this.m[8] * this.m[13] - this.m[12] * this.m[9];
    const f06 = this.m[6] * this.m[15] - this.m[14] * this.m[7];
    const f07 = this.m[5] * this.m[15] - this.m[13] * this.m[7];
    const f08 = this.m[5] * this.m[14] - this.m[13] * this.m[6];
    const f09 = this.m[4] * this.m[15] - this.m[12] * this.m[7];
    const f10 = this.m[4] * this.m[14] - this.m[12] * this.m[6];
    const f11 = this.m[5] * this.m[15] - this.m[13] * this.m[7];
    const f12 = this.m[4] * this.m[13] - this.m[12] * this.m[5];
    const f13 = this.m[6] * this.m[11] - this.m[10] * this.m[7];
    const f14 = this.m[5] * this.m[11] - this.m[9] * this.m[7];
    const f15 = this.m[5] * this.m[10] - this.m[9] * this.m[6];
    const f16 = this.m[4] * this.m[11] - this.m[8] * this.m[7];
    const f17 = this.m[4] * this.m[10] - this.m[8] * this.m[6];
    const f18 = this.m[4] * this.m[9] - this.m[8] * this.m[5];
    out[0] = this.m[5] * f00 - this.m[6] * f01 + this.m[7] * f02;
    out[4] = -(this.m[4] * f00 - this.m[6] * f03 + this.m[7] * f04);
    out[8] = this.m[4] * f01 - this.m[5] * f03 + this.m[7] * f05;
    out[12] = -(this.m[4] * f02 - this.m[5] * f04 + this.m[6] * f05);
    out[1] = -(this.m[1] * f00 - this.m[2] * f01 + this.m[3] * f02);
    out[5] = this.m[0] * f00 - this.m[2] * f03 + this.m[3] * f04;
    out[9] = -(this.m[0] * f01 - this.m[1] * f03 + this.m[3] * f05);
    out[13] = this.m[0] * f02 - this.m[1] * f04 + this.m[2] * f05;
    out[2] = this.m[1] * f06 - this.m[2] * f07 + this.m[3] * f08;
    out[6] = -(this.m[0] * f06 - this.m[2] * f09 + this.m[3] * f10);
    out[10] = this.m[0] * f11 - this.m[1] * f09 + this.m[3] * f12;
    out[14] = -(this.m[0] * f08 - this.m[1] * f10 + this.m[2] * f12);
    out[3] = -(this.m[1] * f13 - this.m[2] * f14 + this.m[3] * f15);
    out[7] = this.m[0] * f13 - this.m[2] * f16 + this.m[3] * f17;
    out[11] = -(this.m[0] * f14 - this.m[1] * f16 + this.m[3] * f18);
    out[15] = this.m[0] * f15 - this.m[1] * f17 + this.m[2] * f18;
    const det = this.m[0] * out[0] + this.m[1] * out[4] + this.m[2] * out[8] + this.m[3] * out[12];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[i * 4 + j] *= 1 / det;
      }
    }
    return new _Mat4(out);
  }
  clone() {
    return new _Mat4([...this.m]);
  }
  toString() {
    return this.m.toString();
  }
};
function wave(lo, hi, t, f = (t2) => -Math.cos(t2)) {
  return lo + (f(t) + 1) / 2 * (hi - lo);
}
var A = 1103515245;
var C = 12345;
var M = 2147483648;
var RNG = class {
  seed;
  constructor(seed) {
    this.seed = seed;
  }
  gen() {
    this.seed = (A * this.seed + C) % M;
    return this.seed / M;
  }
  genNumber(a, b) {
    return a + this.gen() * (b - a);
  }
  genVec2(a, b) {
    return new Vec2(
      this.genNumber(a.x, b.x),
      this.genNumber(a.y, b.y)
    );
  }
  genColor(a, b) {
    return new Color(
      this.genNumber(a.r, b.r),
      this.genNumber(a.g, b.g),
      this.genNumber(a.b, b.b)
    );
  }
  genAny(...args) {
    if (args.length === 0) {
      return this.gen();
    } else if (args.length === 1) {
      if (typeof args[0] === "number") {
        return this.genNumber(0, args[0]);
      } else if (args[0] instanceof Vec2) {
        return this.genVec2(vec2(0, 0), args[0]);
      } else if (args[0] instanceof Color) {
        return this.genColor(rgb(0, 0, 0), args[0]);
      }
    } else if (args.length === 2) {
      if (typeof args[0] === "number" && typeof args[1] === "number") {
        return this.genNumber(args[0], args[1]);
      } else if (args[0] instanceof Vec2 && args[1] instanceof Vec2) {
        return this.genVec2(args[0], args[1]);
      } else if (args[0] instanceof Color && args[1] instanceof Color) {
        return this.genColor(args[0], args[1]);
      }
    }
    throw new Error("More than 2 arguments not supported");
  }
};
var defRNG = new RNG(Date.now());
function randSeed(seed) {
  if (seed != null) {
    defRNG.seed = seed;
  }
  return defRNG.seed;
}
function rand(...args) {
  return defRNG.genAny(...args);
}
function randi(...args) {
  return Math.floor(rand(...args));
}
function chance(p) {
  return rand() <= p;
}
function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
function chooseMultiple(list, count) {
  return list.length <= count ? list.slice() : shuffle(list.slice()).slice(0, count);
}
function choose(list) {
  return list[randi(list.length)];
}
function testRectRect(r1, r2) {
  return r1.pos.x + r1.width > r2.pos.x && r1.pos.x < r2.pos.x + r2.width && r1.pos.y + r1.height > r2.pos.y && r1.pos.y < r2.pos.y + r2.height;
}
function testLineLineT(l1, l2) {
  if (l1.p1.x === l1.p2.x && l1.p1.y === l1.p2.y || l2.p1.x === l2.p2.x && l2.p1.y === l2.p2.y) {
    return null;
  }
  const denom = (l2.p2.y - l2.p1.y) * (l1.p2.x - l1.p1.x) - (l2.p2.x - l2.p1.x) * (l1.p2.y - l1.p1.y);
  if (denom === 0) {
    return null;
  }
  const ua = ((l2.p2.x - l2.p1.x) * (l1.p1.y - l2.p1.y) - (l2.p2.y - l2.p1.y) * (l1.p1.x - l2.p1.x)) / denom;
  const ub = ((l1.p2.x - l1.p1.x) * (l1.p1.y - l2.p1.y) - (l1.p2.y - l1.p1.y) * (l1.p1.x - l2.p1.x)) / denom;
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }
  return ua;
}
function testLineLine(l1, l2) {
  const t = testLineLineT(l1, l2);
  if (!t) return null;
  return vec2(
    l1.p1.x + t * (l1.p2.x - l1.p1.x),
    l1.p1.y + t * (l1.p2.y - l1.p1.y)
  );
}
function testRectLine(r, l) {
  const dir = l.p2.sub(l.p1);
  let tmin = Number.NEGATIVE_INFINITY, tmax = Number.POSITIVE_INFINITY;
  if (dir.x != 0) {
    const tx1 = (r.pos.x - l.p1.x) / dir.x;
    const tx2 = (r.pos.x + r.width - l.p1.x) / dir.x;
    tmin = Math.max(tmin, Math.min(tx1, tx2));
    tmax = Math.min(tmax, Math.max(tx1, tx2));
  }
  if (dir.y != 0) {
    const ty1 = (r.pos.y - l.p1.y) / dir.y;
    const ty2 = (r.pos.y + r.height - l.p1.y) / dir.y;
    tmin = Math.max(tmin, Math.min(ty1, ty2));
    tmax = Math.min(tmax, Math.max(ty1, ty2));
  }
  return tmax >= tmin && tmax >= 0 && tmin <= 1;
}
function testRectPoint(r, pt) {
  return pt.x > r.pos.x && pt.x < r.pos.x + r.width && pt.y > r.pos.y && pt.y < r.pos.y + r.height;
}
function testRectCircle(r, c) {
  const nx = Math.max(r.pos.x, Math.min(c.center.x, r.pos.x + r.width));
  const ny = Math.max(r.pos.y, Math.min(c.center.y, r.pos.y + r.height));
  const nearestPoint = vec2(nx, ny);
  return nearestPoint.sdist(c.center) <= c.radius * c.radius;
}
function testRectPolygon(r, p) {
  return testPolygonPolygon(p, new Polygon(r.points()));
}
function testLinePoint(l, pt) {
  const v1 = pt.sub(l.p1);
  const v2 = l.p2.sub(l.p1);
  if (Math.abs(v1.cross(v2)) > Number.EPSILON) {
    return false;
  }
  const t = v1.dot(v2) / v2.dot(v2);
  return t >= 0 && t <= 1;
}
function testLineCircle(l, circle2) {
  const v = l.p2.sub(l.p1);
  const a = v.dot(v);
  const centerToOrigin = l.p1.sub(circle2.center);
  const b = 2 * v.dot(centerToOrigin);
  const c = centerToOrigin.dot(centerToOrigin) - circle2.radius * circle2.radius;
  const dis = b * b - 4 * a * c;
  if (a <= Number.EPSILON || dis < 0) {
    return false;
  } else if (dis == 0) {
    const t = -b / (2 * a);
    if (t >= 0 && t <= 1) {
      return true;
    }
  } else {
    const t1 = (-b + Math.sqrt(dis)) / (2 * a);
    const t2 = (-b - Math.sqrt(dis)) / (2 * a);
    if (t1 >= 0 && t1 <= 1 || t2 >= 0 && t2 <= 1) {
      return true;
    }
  }
  return testCirclePoint(circle2, l.p1);
}
function testLinePolygon(l, p) {
  if (testPolygonPoint(p, l.p1) || testPolygonPoint(p, l.p2)) {
    return true;
  }
  for (let i = 0; i < p.pts.length; i++) {
    const p1 = p.pts[i];
    const p2 = p.pts[(i + 1) % p.pts.length];
    if (testLineLine(l, new Line(p1, p2))) {
      return true;
    }
  }
  return false;
}
function testCirclePoint(c, p) {
  return c.center.sdist(p) < c.radius * c.radius;
}
function testCircleCircle(c12, c22) {
  return c12.center.sdist(c22.center) < (c12.radius + c22.radius) * (c12.radius + c22.radius);
}
function testCirclePolygon(c, p) {
  let prev = p.pts[p.pts.length - 1];
  for (const cur of p.pts) {
    if (testLineCircle(new Line(prev, cur), c)) {
      return true;
    }
    prev = cur;
  }
  if (testCirclePoint(c, p.pts[0])) {
    return true;
  }
  return testPolygonPoint(p, c.center);
}
function testPolygonPolygon(p1, p2) {
  for (let i = 0; i < p1.pts.length; i++) {
    if (testLinePolygon(
      new Line(p1.pts[i], p1.pts[(i + 1) % p1.pts.length]),
      p2
    )) {
      return true;
    }
  }
  if (p1.pts.some((p) => testPolygonPoint(p2, p)) || p2.pts.some((p) => testPolygonPoint(p1, p))) {
    return true;
  }
  return false;
}
function testPolygonPoint(poly, pt) {
  let c = false;
  const p = poly.pts;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if (p[i].y > pt.y != p[j].y > pt.y && pt.x < (p[j].x - p[i].x) * (pt.y - p[i].y) / (p[j].y - p[i].y) + p[i].x) {
      c = !c;
    }
  }
  return c;
}
function testEllipsePoint(ellipse, pt) {
  pt = pt.sub(ellipse.center);
  const angle = deg2rad(ellipse.angle);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const vx = pt.x * c + pt.y * s;
  const vy = -pt.x * s + pt.y * c;
  return vx * vx / (ellipse.radiusX * ellipse.radiusX) + vy * vy / (ellipse.radiusY * ellipse.radiusY) < 1;
}
function testEllipseCircle(ellipse, circle2) {
  const center2 = circle2.center.sub(ellipse.center);
  const angle = deg2rad(ellipse.angle);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const cx = center2.x * c + center2.y * s;
  const cy = -center2.x * s + center2.y * c;
  return testEllipsePoint(
    new Ellipse(
      vec2(),
      ellipse.radiusX + circle2.radius,
      ellipse.radiusY + circle2.radius,
      0
    ),
    vec2(cx, cy)
  );
}
function testEllipseLine(ellipse, line) {
  const T = ellipse.toMat2().inverse;
  line = new Line(
    T.transform(line.p1.sub(ellipse.center)),
    T.transform(line.p2.sub(ellipse.center))
  );
  return testLineCircle(line, new Circle(vec2(), 1));
}
function testEllipseEllipse(ellipse1, ellipse2) {
  if (ellipse1.radiusX === ellipse1.radiusY) {
    return testEllipseCircle(
      ellipse2,
      new Circle(ellipse1.center, ellipse1.radiusX)
    );
  } else if (ellipse2.radiusX === ellipse2.radiusY) {
    return testEllipseCircle(
      ellipse1,
      new Circle(ellipse2.center, ellipse2.radiusX)
    );
  }
  const A1 = new Mat3(
    1 / ellipse1.radiusX ** 2,
    0,
    0,
    0,
    1 / ellipse1.radiusY ** 2,
    0,
    0,
    0,
    -1
  );
  const A2 = new Mat3(
    1 / ellipse2.radiusX ** 2,
    0,
    0,
    0,
    1 / ellipse2.radiusY ** 2,
    0,
    0,
    0,
    -1
  );
  const x1 = ellipse1.center.x;
  const y1 = ellipse1.center.y;
  const x2 = ellipse2.center.x;
  const y2 = ellipse2.center.y;
  const theta1 = deg2rad(ellipse1.angle);
  const theta2 = deg2rad(ellipse2.angle);
  const M1 = new Mat3(
    Math.cos(theta1),
    -Math.sin(theta1),
    x1,
    Math.sin(theta1),
    Math.cos(theta1),
    y1,
    0,
    0,
    1
  );
  const M2 = new Mat3(
    Math.cos(theta2),
    -Math.sin(theta2),
    x2,
    Math.sin(theta2),
    Math.cos(theta2),
    y2,
    0,
    0,
    1
  );
  const M1inv = M1.inverse;
  const M2inv = M2.inverse;
  const A3 = M1inv.transpose.mul(A1).mul(M1inv);
  const B = M2inv.transpose.mul(A2).mul(M2inv);
  const a11 = A3.m11;
  const a12 = A3.m12;
  const a13 = A3.m13;
  const a21 = A3.m21;
  const a22 = A3.m22;
  const a23 = A3.m23;
  const a31 = A3.m31;
  const a32 = A3.m32;
  const a33 = A3.m33;
  const b11 = B.m11;
  const b12 = B.m12;
  const b13 = B.m13;
  const b21 = B.m21;
  const b22 = B.m22;
  const b23 = B.m23;
  const b31 = B.m31;
  const b32 = B.m32;
  const b33 = B.m33;
  const factor = a11 * a22 * a33 - a11 * a23 * a32 - a12 * a21 * a33 + a12 * a23 * a31 + a13 * a21 * a32 - a13 * a22 * a31;
  const a = (a11 * a22 * b33 - a11 * a23 * b32 - a11 * a32 * b23 + a11 * a33 * b22 - a12 * a21 * b33 + a12 * a23 * b31 + a12 * a31 * b23 - a12 * a33 * b21 + a13 * a21 * b32 - a13 * a22 * b31 - a13 * a31 * b22 + a13 * a32 * b21 + a21 * a32 * b13 - a21 * a33 * b12 - a22 * a31 * b13 + a22 * a33 * b11 + a23 * a31 * b12 - a23 * a32 * b11) / factor;
  const b = (a11 * b22 * b33 - a11 * b23 * b32 - a12 * b21 * b33 + a12 * b23 * b31 + a13 * b21 * b32 - a13 * b22 * b31 - a21 * b12 * b33 + a21 * b13 * b32 + a22 * b11 * b33 - a22 * b13 * b31 - a23 * b11 * b32 + a23 * b12 * b31 + a31 * b12 * b23 - a31 * b13 * b22 - a32 * b11 * b23 + a32 * b13 * b21 + a33 * b11 * b22 - a33 * b12 * b21) / factor;
  const c = (b11 * b22 * b33 - b11 * b23 * b32 - b12 * b21 * b33 + b12 * b23 * b31 + b13 * b21 * b32 - b13 * b22 * b31) / factor;
  if (a >= 0) {
    const condition1 = -3 * b + a ** 2;
    const condition2 = 3 * a * c + b * a ** 2 - 4 * b ** 2;
    const condition3 = -27 * c ** 2 + 18 * c * a * b + a ** 2 * b ** 2 - 4 * a ** 3 * c - 4 * b ** 3;
    if (condition1 > 0 && condition2 < 0 && condition3 > 0) {
      return false;
    } else {
      return true;
    }
  } else {
    const condition1 = -3 * b + a ** 2;
    const condition2 = -27 * c ** 2 + 18 * c * a * b + a ** 2 * b ** 2 - 4 * a ** 3 * c - 4 * b ** 3;
    if (condition1 > 0 && condition2 > 0) {
      return false;
    } else {
      return true;
    }
  }
}
function testEllipseRect(ellipse, rect2) {
  return testEllipsePolygon(ellipse, new Polygon(rect2.points()));
}
function testEllipsePolygon(ellipse, poly) {
  const T = ellipse.toMat2().inverse;
  poly = new Polygon(poly.pts.map((p) => T.transform(p.sub(ellipse.center))));
  return testCirclePolygon(new Circle(vec2(), 1), poly);
}
function testPointPoint(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}
function testPointShape(point, shape) {
  if (shape instanceof Vec2) {
    return testPointPoint(shape, point.pt);
  } else if (shape instanceof Circle) {
    return testCirclePoint(shape, point.pt);
  } else if (shape instanceof Line) {
    return testLinePoint(shape, point.pt);
  } else if (shape instanceof Rect) {
    return testRectPoint(shape, point.pt);
  } else if (shape instanceof Polygon) {
    return testPolygonPoint(shape, point.pt);
  } else if (shape instanceof Ellipse) {
    return testEllipsePoint(shape, point.pt);
  } else {
    return false;
  }
}
function testLineShape(line, shape) {
  if (shape instanceof Vec2) {
    return testLinePoint(line, shape);
  } else if (shape instanceof Circle) {
    return testLineCircle(line, shape);
  } else if (shape instanceof Line) {
    return testLineLine(line, shape) != null;
  } else if (shape instanceof Rect) {
    return testRectLine(shape, line);
  } else if (shape instanceof Polygon) {
    return testLinePolygon(line, shape);
  } else if (shape instanceof Ellipse) {
    return testEllipseLine(shape, line);
  } else {
    return false;
  }
}
function testCircleShape(circle2, shape) {
  if (shape instanceof Vec2) {
    return testCirclePoint(circle2, shape);
  } else if (shape instanceof Circle) {
    return testCircleCircle(circle2, shape);
  } else if (shape instanceof Line) {
    return testLineCircle(shape, circle2);
  } else if (shape instanceof Rect) {
    return testRectCircle(shape, circle2);
  } else if (shape instanceof Polygon) {
    return testCirclePolygon(circle2, shape);
  } else if (shape instanceof Ellipse) {
    return testEllipseCircle(shape, circle2);
  } else {
    return false;
  }
}
function testRectShape(rect2, shape) {
  if (shape instanceof Vec2) {
    return testRectPoint(rect2, shape);
  } else if (shape instanceof Circle) {
    return testRectCircle(rect2, shape);
  } else if (shape instanceof Line) {
    return testRectLine(rect2, shape);
  } else if (shape instanceof Rect) {
    return testRectRect(rect2, shape);
  } else if (shape instanceof Polygon) {
    return testRectPolygon(rect2, shape);
  } else if (shape instanceof Ellipse) {
    return testEllipseRect(shape, rect2);
  } else {
    return false;
  }
}
function testPolygonShape(polygon2, shape) {
  if (shape instanceof Vec2) {
    return testPolygonPoint(polygon2, shape);
  } else if (shape instanceof Circle) {
    return testCirclePolygon(shape, polygon2);
  } else if (shape instanceof Line) {
    return testLinePolygon(shape, polygon2);
  } else if (shape instanceof Rect) {
    return testRectPolygon(shape, polygon2);
  } else if (shape instanceof Polygon) {
    return testPolygonPolygon(shape, polygon2);
  } else if (shape instanceof Ellipse) {
    return testEllipsePolygon(shape, polygon2);
  } else {
    return false;
  }
}
function testEllipseShape(ellipse, shape) {
  if (shape instanceof Vec2) {
    return testEllipsePoint(ellipse, shape);
  } else if (shape instanceof Circle) {
    return testEllipseCircle(ellipse, shape);
  } else if (shape instanceof Line) {
    return testEllipseLine(ellipse, shape);
  } else if (shape instanceof Rect) {
    return testEllipseRect(ellipse, shape);
  } else if (shape instanceof Polygon) {
    return testEllipsePolygon(ellipse, shape);
  } else if (shape instanceof Ellipse) {
    return testEllipseEllipse(shape, ellipse);
  } else {
    return false;
  }
}
function raycastLine(origin, direction, line) {
  const a = origin;
  const c = line.p1;
  const d = line.p2;
  const ab = direction;
  const cd = d.sub(c);
  const abxcd = ab.cross(cd);
  if (Math.abs(abxcd) < Number.EPSILON) {
    return null;
  }
  const ac = c.sub(a);
  const s = ac.cross(cd) / abxcd;
  if (s <= 0 || s >= 1) {
    return null;
  }
  const t = ac.cross(ab) / abxcd;
  if (t <= 0 || t >= 1) {
    return null;
  }
  const normal = cd.normal().unit();
  if (direction.dot(normal) > 0) {
    normal.x *= -1;
    normal.y *= -1;
  }
  return {
    point: a.add(ab.scale(s)),
    normal,
    fraction: s
  };
}
function raycastRect(origin, direction, rect2) {
  let tmin = Number.NEGATIVE_INFINITY, tmax = Number.POSITIVE_INFINITY;
  let normal;
  if (origin.x != 0) {
    const tx1 = (rect2.pos.x - origin.x) / direction.x;
    const tx2 = (rect2.pos.x + rect2.width - origin.x) / direction.x;
    normal = vec2(-Math.sign(direction.x), 0);
    tmin = Math.max(tmin, Math.min(tx1, tx2));
    tmax = Math.min(tmax, Math.max(tx1, tx2));
  }
  if (origin.y != 0) {
    const ty1 = (rect2.pos.y - origin.y) / direction.y;
    const ty2 = (rect2.pos.y + rect2.height - origin.y) / direction.y;
    if (Math.min(ty1, ty2) > tmin) {
      normal = vec2(0, -Math.sign(direction.y));
    }
    tmin = Math.max(tmin, Math.min(ty1, ty2));
    tmax = Math.min(tmax, Math.max(ty1, ty2));
  }
  if (tmax >= tmin && tmin >= 0 && tmin <= 1) {
    const point = origin.add(direction.scale(tmin));
    return {
      point,
      normal,
      fraction: tmin
    };
  } else {
    return null;
  }
}
function raycastCircle(origin, direction, circle2) {
  const a = origin;
  const c = circle2.center;
  const ab = direction;
  const A2 = ab.dot(ab);
  const centerToOrigin = a.sub(c);
  const B = 2 * ab.dot(centerToOrigin);
  const C2 = centerToOrigin.dot(centerToOrigin) - circle2.radius * circle2.radius;
  const disc = B * B - 4 * A2 * C2;
  if (A2 <= Number.EPSILON || disc < 0) {
    return null;
  } else if (disc == 0) {
    const t = -B / (2 * A2);
    if (t >= 0 && t <= 1) {
      const point = a.add(ab.scale(t));
      return {
        point,
        normal: point.sub(c),
        fraction: t
      };
    }
  } else {
    const t1 = (-B + Math.sqrt(disc)) / (2 * A2);
    const t2 = (-B - Math.sqrt(disc)) / (2 * A2);
    let t = null;
    if (t1 >= 0 && t1 <= 1) {
      t = t1;
    }
    if (t2 >= 0 && t2 <= 1) {
      t = Math.min(t2, t ?? t2);
    }
    if (t != null) {
      const point = a.add(ab.scale(t));
      return {
        point,
        normal: point.sub(c).unit(),
        fraction: t
      };
    }
  }
  return null;
}
function raycastPolygon(origin, direction, polygon2) {
  const points = polygon2.pts;
  let minHit = null;
  let prev = points[points.length - 1];
  for (let i = 0; i < points.length; i++) {
    const cur = points[i];
    const hit = raycastLine(origin, direction, new Line(prev, cur));
    if (hit && (!minHit || minHit.fraction > hit.fraction)) {
      minHit = hit;
    }
    prev = cur;
  }
  return minHit;
}
function raycastEllipse(origin, direction, ellipse) {
  const T = ellipse.toMat2();
  const TI = T.inverse;
  const Torigin = TI.transform(origin.sub(ellipse.center));
  const Tdirection = TI.transform(direction);
  const result = raycastCircle(Torigin, Tdirection, new Circle(vec2(), 1));
  if (result) {
    const R = Mat2.rotation(deg2rad(-ellipse.angle));
    const S = Mat2.scale(ellipse.radiusX, ellipse.radiusY);
    const p = S.transform(result.point);
    const point = T.transform(result.point).add(ellipse.center);
    const fraction = point.dist(origin) / direction.len();
    return {
      point,
      // Calculate the normal at the unrotated ellipse, then rotate the normal to the rotated ellipse
      normal: R.transform(
        vec2(ellipse.radiusY ** 2 * p.x, ellipse.radiusX ** 2 * p.y)
      ).unit(),
      fraction
    };
  }
  return result;
}
function raycastGrid(origin, direction, gridPosHit, maxDistance = 64) {
  const pos2 = origin;
  const len = direction.len();
  const dir = direction.scale(1 / len);
  let t = 0;
  const gridPos = vec2(Math.floor(origin.x), Math.floor(origin.y));
  const step = vec2(dir.x > 0 ? 1 : -1, dir.y > 0 ? 1 : -1);
  const tDelta = vec2(Math.abs(1 / dir.x), Math.abs(1 / dir.y));
  const dist = vec2(
    step.x > 0 ? gridPos.x + 1 - origin.x : origin.x - gridPos.x,
    step.y > 0 ? gridPos.y + 1 - origin.y : origin.y - gridPos.y
  );
  const tMax = vec2(
    tDelta.x < Infinity ? tDelta.x * dist.x : Infinity,
    tDelta.y < Infinity ? tDelta.y * dist.y : Infinity
  );
  let steppedIndex = -1;
  while (t <= maxDistance) {
    const hit = gridPosHit(gridPos);
    if (hit === true) {
      return {
        point: pos2.add(dir.scale(t)),
        normal: vec2(
          steppedIndex === 0 ? -step.x : 0,
          steppedIndex === 1 ? -step.y : 0
        ),
        fraction: t / len,
        // Since dir is normalized, t is len times too large
        gridPos
      };
    } else if (hit) {
      return hit;
    }
    if (tMax.x < tMax.y) {
      gridPos.x += step.x;
      t = tMax.x;
      tMax.x += tDelta.x;
      steppedIndex = 0;
    } else {
      gridPos.y += step.y;
      t = tMax.y;
      tMax.y += tDelta.y;
      steppedIndex = 1;
    }
  }
  return null;
}
var Point = class _Point {
  pt;
  constructor(pt) {
    this.pt = pt.clone();
  }
  transform(m) {
    return new _Point(m.multVec2(this.pt));
  }
  bbox() {
    return new Rect(this.pt, 0, 0);
  }
  area() {
    return 0;
  }
  clone() {
    return new _Point(this.pt);
  }
  collides(shape) {
    return testPointShape(this, shape);
  }
  contains(point) {
    return this.pt.eq(point);
  }
  raycast(origin, direction) {
    return null;
  }
  random() {
    return this.pt.clone();
  }
};
var Line = class _Line {
  p1;
  p2;
  constructor(p1, p2) {
    this.p1 = p1.clone();
    this.p2 = p2.clone();
  }
  transform(m) {
    return new _Line(m.multVec2(this.p1), m.multVec2(this.p2));
  }
  bbox() {
    return Rect.fromPoints(this.p1, this.p2);
  }
  area() {
    return this.p1.dist(this.p2);
  }
  clone() {
    return new _Line(this.p1, this.p2);
  }
  collides(shape) {
    return testLineShape(this, shape);
  }
  contains(point) {
    return this.collides(point);
  }
  raycast(origin, direction) {
    return raycastLine(origin, direction, this);
  }
  random() {
    return this.p1.add(this.p2.sub(this.p1).scale(rand(1)));
  }
};
var Rect = class _Rect {
  pos;
  width;
  height;
  constructor(pos2, width2, height2) {
    this.pos = pos2.clone();
    this.width = width2;
    this.height = height2;
  }
  static fromPoints(p1, p2) {
    return new _Rect(p1.clone(), p2.x - p1.x, p2.y - p1.y);
  }
  center() {
    return new Vec2(
      this.pos.x + this.width / 2,
      this.pos.y + this.height / 2
    );
  }
  points() {
    return [
      this.pos,
      this.pos.add(this.width, 0),
      this.pos.add(this.width, this.height),
      this.pos.add(0, this.height)
    ];
  }
  transform(m) {
    return new Polygon(this.points().map((pt) => m.multVec2(pt)));
  }
  bbox() {
    return this.clone();
  }
  area() {
    return this.width * this.height;
  }
  clone() {
    return new _Rect(this.pos.clone(), this.width, this.height);
  }
  distToPoint(p) {
    return Math.sqrt(this.sdistToPoint(p));
  }
  sdistToPoint(p) {
    const min = this.pos;
    const max = this.pos.add(this.width, this.height);
    const dx = Math.max(min.x - p.x, 0, p.x - max.x);
    const dy = Math.max(min.y - p.y, 0, p.y - max.y);
    return dx * dx + dy * dy;
  }
  collides(shape) {
    return testRectShape(this, shape);
  }
  contains(point) {
    return this.collides(point);
  }
  raycast(origin, direction) {
    return raycastRect(origin, direction, this);
  }
  random() {
    return this.pos.add(rand(this.width), rand(this.height));
  }
};
var Circle = class _Circle {
  center;
  radius;
  constructor(center2, radius) {
    this.center = center2.clone();
    this.radius = radius;
  }
  transform(tr) {
    return new Ellipse(this.center, this.radius, this.radius).transform(tr);
  }
  bbox() {
    return Rect.fromPoints(
      this.center.sub(vec2(this.radius)),
      this.center.add(vec2(this.radius))
    );
  }
  area() {
    return this.radius * this.radius * Math.PI;
  }
  clone() {
    return new _Circle(this.center, this.radius);
  }
  collides(shape) {
    return testCircleShape(this, shape);
  }
  contains(point) {
    return this.collides(point);
  }
  raycast(origin, direction) {
    return raycastCircle(origin, direction, this);
  }
  random() {
    return this.center.add(
      Vec2.fromAngle(rand(360)).scale(rand(this.radius))
    );
  }
};
var Ellipse = class _Ellipse {
  center;
  radiusX;
  radiusY;
  angle;
  constructor(center2, rx, ry, degrees = 0) {
    this.center = center2.clone();
    this.radiusX = rx;
    this.radiusY = ry;
    this.angle = degrees;
  }
  static fromMat2(tr) {
    const inv = tr.inverse;
    const M2 = inv.transpose.mul(inv);
    const [e1, e2] = M2.eigenvalues;
    const [v1, v2] = M2.eigenvectors(e1, e2);
    const [a, b] = [1 / Math.sqrt(e1), 1 / Math.sqrt(e2)];
    if (a > b) {
      return new _Ellipse(
        vec2(),
        a,
        b,
        rad2deg(Math.atan2(-v1[1], v1[0]))
      );
    } else {
      return new _Ellipse(
        vec2(),
        b,
        a,
        rad2deg(Math.atan2(-v2[1], v2[0]))
      );
    }
  }
  toMat2() {
    const a = deg2rad(this.angle);
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new Mat2(
      c * this.radiusX,
      -s * this.radiusY,
      s * this.radiusX,
      c * this.radiusY
    );
  }
  transform(tr) {
    if (this.angle == 0 && tr.getRotation() == 0) {
      return new _Ellipse(
        tr.multVec2(this.center),
        tr.m[0] * this.radiusX,
        tr.m[5] * this.radiusY
      );
    } else {
      let T = this.toMat2();
      const angle = tr.getRotation();
      const scale2 = tr.getScale();
      const M2 = Mat3.fromMat2(T).scale(scale2.x, scale2.y).rotate(angle);
      T = M2.toMat2();
      const ellipse = _Ellipse.fromMat2(T);
      ellipse.center = tr.multVec2(this.center);
      return ellipse;
    }
  }
  bbox() {
    if (this.angle == 0) {
      return Rect.fromPoints(
        this.center.sub(vec2(this.radiusX, this.radiusY)),
        this.center.add(vec2(this.radiusX, this.radiusY))
      );
    } else {
      const angle = deg2rad(this.angle);
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const ux = this.radiusX * c;
      const uy = this.radiusX * s;
      const vx = this.radiusY * s;
      const vy = this.radiusY * c;
      const halfwidth = Math.sqrt(ux * ux + vx * vx);
      const halfheight = Math.sqrt(uy * uy + vy * vy);
      return Rect.fromPoints(
        this.center.sub(vec2(halfwidth, halfheight)),
        this.center.add(vec2(halfwidth, halfheight))
      );
    }
  }
  area() {
    return this.radiusX * this.radiusY * Math.PI;
  }
  clone() {
    return new _Ellipse(this.center, this.radiusX, this.radiusY, this.angle);
  }
  collides(shape) {
    return testEllipseShape(this, shape);
  }
  contains(point) {
    point = point.sub(this.center);
    const angle = deg2rad(this.angle);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const vx = point.x * c + point.y * s;
    const vy = -point.x * s + point.y * c;
    return vx * vx / (this.radiusX * this.radiusX) + vy * vy / (this.radiusY * this.radiusY) < 1;
  }
  raycast(origin, direction) {
    return raycastEllipse(origin, direction, this);
  }
  random() {
    return this.center;
  }
};
function segmentLineIntersection(a, b, c, d) {
  const ab = b.sub(a);
  const cd = d.sub(c);
  let s = ab.cross(cd);
  if (s < 1e-5 && s > -1e-5) return null;
  const ac = c.sub(a);
  s = ac.cross(cd) / s;
  if (s < 0 || s > 1) return null;
  return a.add(ab.scale(s));
}
var Polygon = class _Polygon {
  pts;
  constructor(pts) {
    if (pts.length < 3) {
      throw new Error("Polygons should have at least 3 vertices");
    }
    this.pts = pts;
  }
  transform(m) {
    return new _Polygon(this.pts.map((pt) => m.multVec2(pt)));
  }
  bbox() {
    const p1 = vec2(Number.MAX_VALUE);
    const p2 = vec2(-Number.MAX_VALUE);
    for (const pt of this.pts) {
      p1.x = Math.min(p1.x, pt.x);
      p2.x = Math.max(p2.x, pt.x);
      p1.y = Math.min(p1.y, pt.y);
      p2.y = Math.max(p2.y, pt.y);
    }
    return Rect.fromPoints(p1, p2);
  }
  area() {
    let total = 0;
    const l = this.pts.length;
    for (let i = 0; i < l; i++) {
      const p1 = this.pts[i];
      const p2 = this.pts[(i + 1) % l];
      total += p1.x * p2.y * 0.5;
      total -= p2.x * p1.y * 0.5;
    }
    return Math.abs(total);
  }
  clone() {
    return new _Polygon(this.pts.map((pt) => pt.clone()));
  }
  collides(shape) {
    return testPolygonShape(this, shape);
  }
  contains(point) {
    return this.collides(point);
  }
  raycast(origin, direction) {
    return raycastPolygon(origin, direction, this);
  }
  random() {
    return vec2();
  }
  cut(a, b) {
    const surfaceLine = new Line(a, b);
    const left = [];
    const right = [];
    const ab = b.sub(a);
    let prev = this.pts[this.pts.length - 1];
    let ap = prev.sub(a);
    let wasLeft = ab.cross(ap) > 0;
    this.pts.forEach((p) => {
      ap = p.sub(a);
      const isLeft = ab.cross(ap) > 0;
      if (wasLeft != isLeft) {
        const intersection = segmentLineIntersection(prev, p, a, b);
        left.push(intersection);
        right.push(intersection);
        wasLeft = isLeft;
      }
      (isLeft ? left : right).push(p);
      prev = p;
    });
    return [
      left.length ? new _Polygon(left) : null,
      right.length ? new _Polygon(right) : null
    ];
  }
};
function evaluateQuadratic(pt1, pt2, pt3, t) {
  const t2 = t * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  return pt1.scale(mt2).add(pt2.scale(2 * mt * t)).add(
    pt3.scale(t2)
  );
}
function evaluateQuadraticFirstDerivative(pt1, pt2, pt3, t) {
  const mt = 1 - t;
  return pt2.sub(pt1).scale(2 * mt).add(pt3.sub(pt2).scale(2 * t));
}
function evaluateQuadraticSecondDerivative(pt1, pt2, pt3, t) {
  return pt3.sub(pt2.scale(2)).add(pt1).scale(2);
}
function evaluateBezier(pt1, pt2, pt3, pt4, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  return pt1.scale(mt3).add(pt2.scale(3 * mt2 * t)).add(
    pt3.scale(3 * mt * t2)
  ).add(pt4.scale(t3));
}
function evaluateBezierFirstDerivative(pt1, pt2, pt3, pt4, t) {
  const t2 = t * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  return pt2.sub(pt1).scale(3 * mt2).add(pt3.sub(pt2).scale(6 * mt * t)).add(
    pt4.sub(pt3).scale(3 * t2)
  );
}
function evaluateBezierSecondDerivative(pt1, pt2, pt3, pt4, t) {
  const mt = 1 - t;
  return pt3.sub(pt2.scale(2)).add(pt1).scale(6 * mt).add(
    pt4.sub(pt3.scale(2)).add(pt2).scale(6 * t)
  );
}
function evaluateCatmullRom(pt1, pt2, pt3, pt4, t) {
  const A2 = 0.5 * (((-t + 2) * t - 1) * t);
  const B = 0.5 * ((3 * t - 5) * t * t + 2);
  const C2 = 0.5 * (((-3 * t + 4) * t + 1) * t);
  const D = 0.5 * ((t - 1) * t * t);
  return pt1.scale(A2).add(pt2.scale(B)).add(pt3.scale(C2)).add(pt4.scale(D));
}
function evaluateCatmullRomFirstDerivative(pt1, pt2, pt3, pt4, t) {
  const A2 = 0.5 * ((-3 * t + 4) * t - 1);
  const B = 0.5 * ((9 * t - 10) * t);
  const C2 = 0.5 * ((-9 * t + 8) * t + 1);
  const D = 0.5 * ((3 * t - 2) * t);
  return pt1.scale(A2).add(pt2.scale(B)).add(pt3.scale(C2)).add(pt4.scale(D));
}
function normalizedCurve(curve) {
  const curveLength = curveLengthApproximation(curve);
  const length = curveLength(1);
  return (s) => {
    const l = s * length;
    const t = curveLength(l, true);
    return curve(t);
  };
}
function curveLengthApproximation(curve, entries = 10, detail = 10) {
  const llut = [0];
  const tlut = [0];
  const dt2 = 1 / (entries - 1);
  const ddt = dt2 / detail;
  let length = 0;
  let pp = curve(0);
  let t = 0;
  for (let e = 1; e < entries; e++) {
    for (let d = 0; d < detail; d++) {
      t += ddt;
      const p = curve(t);
      const l = p.dist(pp);
      length += l;
      pp = p;
    }
    llut[e] = length;
    tlut[e] = t;
  }
  tlut[entries - 1] = 1;
  return (t2, inverse = false) => {
    if (inverse) {
      const l = t2;
      if (l <= 0) return 0;
      if (l >= length) return 1;
      let index = 0;
      while (llut[index + 1] < l) index++;
      const t1 = tlut[index];
      const t22 = tlut[index + 1];
      const l1 = llut[index];
      const l2 = llut[index + 1];
      const a = (l - l1) / (l2 - l1);
      return t1 + (t22 - t1) * a;
    } else {
      if (t2 <= 0) return 0;
      if (t2 >= 1) return llut[entries - 1];
      let index = 0;
      while (tlut[index + 1] < t2) index++;
      const t1 = tlut[index];
      const t22 = tlut[index + 1];
      const l1 = llut[index];
      const l2 = llut[index + 1];
      const a = (t2 - t1) / (t22 - t1);
      return l1 + (l2 - l1) * a;
    }
  };
}
function hermite(pt1, m1, m2, pt2) {
  const A2 = 2 * pt1 + m1 - 2 * pt2 + m2;
  const B = -3 * pt1 + 3 * pt2 - 2 * m1 - m2;
  const C2 = m1;
  const D = pt1;
  return (t) => {
    const t2 = t * t;
    const t3 = t2 * t;
    return A2 * t3 + B * t2 + C2 * t + D;
  };
}
function cardinal(pt1, pt2, pt3, pt4, tension, h = hermite) {
  const hx = h(
    pt2.x,
    (1 - tension) * (pt3.x - pt1.x),
    (1 - tension) * (pt4.x - pt2.x),
    pt3.x
  );
  const hy = h(
    pt2.y,
    (1 - tension) * (pt3.y - pt1.y),
    (1 - tension) * (pt4.y - pt2.y),
    pt3.y
  );
  return (t) => {
    return new Vec2(hx(t), hy(t));
  };
}
function catmullRom(pt1, pt2, pt3, pt4, h = hermite) {
  return cardinal(pt1, pt2, pt3, pt4, 0.5, h);
}
function bezier(pt1, pt2, pt3, pt4, h = hermite) {
  return catmullRom(
    pt4.add(pt1.sub(pt2).scale(6)),
    pt1,
    pt4,
    pt1.add(pt4.sub(pt3).scale(6)),
    h
  );
}
function kochanekBartels(pt1, pt2, pt3, pt4, tension, continuity, bias, h = hermite) {
  const hx = h(
    pt2.x,
    0.5 * (1 - tension) * (1 + bias) * (1 + continuity) * (pt2.x - pt1.x) + 0.5 * (1 - tension) * (1 - bias) * (1 - continuity) * (pt3.x - pt2.x),
    0.5 * (1 - tension) * (1 + bias) * (1 - continuity) * (pt3.x - pt2.x) + 0.5 * (1 - tension) * (1 - bias) * (1 + continuity) * (pt4.x - pt3.x),
    pt3.x
  );
  const hy = h(
    pt2.y,
    0.5 * (1 - tension) * (1 + bias) * (1 + continuity) * (pt2.y - pt1.y) + 0.5 * (1 - tension) * (1 - bias) * (1 - continuity) * (pt3.y - pt2.y),
    0.5 * (1 - tension) * (1 + bias) * (1 - continuity) * (pt3.y - pt2.y) + 0.5 * (1 - tension) * (1 - bias) * (1 + continuity) * (pt4.y - pt3.y),
    pt3.y
  );
  return (t) => {
    return new Vec2(hx(t), hy(t));
  };
}
function hermiteFirstDerivative(pt1, m1, m2, pt2) {
  const A2 = 2 * pt1 + m1 - 2 * pt2 + m2;
  const B = -3 * pt1 + 3 * pt2 - 2 * m1 + m2;
  const C2 = m1;
  return (t) => {
    const t2 = t * t;
    return 3 * A2 * t2 + 2 * B * t + C2;
  };
}
function inZeroOneDomain(t) {
  return 0 <= t && t <= 1;
}
function approximately(a, b) {
  return Math.abs(a - b) <= Number.EPSILON;
}
function cubeRoot(v) {
  if (v < 0) {
    return -Math.pow(-v, 1 / 3);
  } else {
    return Math.pow(v, 1 / 3);
  }
}
function getCubicRoots(pa, pb, pc, pd) {
  let a = 3 * pa - 6 * pb + 3 * pc;
  let b = -3 * pa + 3 * pb;
  let c = pa;
  let d = -pa + 3 * pb - 3 * pc + pd;
  if (approximately(d, 0)) {
    if (approximately(a, 0)) {
      if (approximately(b, 0)) {
        return [];
      }
      return [-c / b].filter(inZeroOneDomain);
    }
    const q3 = Math.sqrt(b * b - 4 * a * c);
    const a2 = 2 * a;
    return [(q3 - b) / a2, (-b - q3) / a2].filter(inZeroOneDomain);
  }
  a /= d;
  b /= d;
  c /= d;
  const p = (3 * b - a * a) / 3;
  const p3 = p / 3;
  const q = (2 * a * a * a - 9 * a * b + 27 * c) / 27;
  const q2 = q / 2;
  const discriminant = q2 * q2 + p3 * p3 * p3;
  if (discriminant < 0) {
    const mp3 = -p / 3;
    const mp33 = mp3 * mp3 * mp3;
    const r = Math.sqrt(mp33);
    const t = -q / (2 * r);
    const cosphi = t < -1 ? -1 : t > 1 ? 1 : t;
    const phi = Math.acos(cosphi);
    const crtr = cubeRoot(r);
    const t1 = 2 * crtr;
    const root12 = t1 * Math.cos(phi / 3) - a / 3;
    const root2 = t1 * Math.cos((phi + 2 * Math.PI) / 3) - a / 3;
    const root3 = t1 * Math.cos((phi + 4 * Math.PI) / 3) - a / 3;
    return [root12, root2, root3].filter(inZeroOneDomain);
  }
  if (discriminant === 0) {
    const u12 = q2 < 0 ? cubeRoot(-q2) : -cubeRoot(q2);
    const root12 = 2 * u12 - a / 3;
    const root2 = -u12 - a / 3;
    return [root12, root2].filter(inZeroOneDomain);
  }
  const sd = Math.sqrt(discriminant);
  const u1 = cubeRoot(sd - q2);
  const v1 = cubeRoot(sd + q2);
  const root1 = u1 - v1 - a / 3;
  return [root1].filter(inZeroOneDomain);
}
function cubicBezierYforX(a, b, c, d, x) {
  const t = getCubicRoots(a.x - x, b.x - x, c.x - x, d.x - x);
  if (t.length > 0) {
    return evaluateBezier(a, b, c, d, t[0]).y;
  }
  return NaN;
}
function easingLinear(keys) {
  if (!keys || keys.length == 0) {
    throw new Error(
      "Need at least one point for easingLinear."
    );
  }
  const len = keys.length;
  return (x) => {
    if (x <= 0 || keys.length == 1 || x <= keys[0].x) {
      return keys[0].y;
    }
    for (let i = 0; i < len; i++) {
      if (keys[i].x >= x) {
        return map(
          x,
          keys[i - 1].x,
          keys[i].x,
          keys[i - 1].y,
          keys[i].y
        );
      }
    }
    return keys[keys.length - 1].y;
  };
}
function easingCubicBezier(p1, p2) {
  return (x) => {
    return cubicBezierYforX(vec2(0, 0), p1, p2, vec2(1, 1), x);
  };
}
function easingSteps(steps, position = "jump-end") {
  const xdist = 1 / steps;
  const jumpStart = position == "jump-start" || position == "jump-both";
  const jumpEnd = position == "jump-end" || position == "jump-both";
  const ydist = 1 / (steps + (jumpEnd ? 1 : 0));
  const startY = jumpStart ? ydist : 0;
  return (x) => {
    const step = Math.floor(x / xdist);
    return startY + step * ydist;
  };
}
function sat(p1, p2) {
  let overlap = Number.MAX_VALUE;
  let result = { normal: vec2(0), distance: 0 };
  for (const poly of [p1, p2]) {
    for (let i = 0; i < poly.pts.length; i++) {
      const a = poly.pts[i];
      const b = poly.pts[(i + 1) % poly.pts.length];
      const axisProj = b.sub(a).normal().unit();
      let min1 = Number.MAX_VALUE;
      let max1 = -Number.MAX_VALUE;
      for (let j = 0; j < p1.pts.length; j++) {
        const q = p1.pts[j].dot(axisProj);
        min1 = Math.min(min1, q);
        max1 = Math.max(max1, q);
      }
      let min2 = Number.MAX_VALUE;
      let max2 = -Number.MAX_VALUE;
      for (let j = 0; j < p2.pts.length; j++) {
        const q = p2.pts[j].dot(axisProj);
        min2 = Math.min(min2, q);
        max2 = Math.max(max2, q);
      }
      const o = Math.min(max1, max2) - Math.max(min1, min2);
      if (o < 0) {
        return null;
      }
      if (o < Math.abs(overlap)) {
        const o1 = max2 - min1;
        const o2 = min2 - max1;
        overlap = Math.abs(o1) < Math.abs(o2) ? o1 : o2;
        result.normal = axisProj;
        result.distance = overlap;
      }
    }
  }
  return result;
}
function isOrientedCcw(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 0;
}
function isOrientedCcwPolygon(polygon2) {
  let total = 0;
  let prev = polygon2[polygon2.length - 1];
  for (let i = 0; i < polygon2.length; i++) {
    total += (polygon2[i].x - prev.x) * (polygon2[i].y + prev.y);
    prev = polygon2[i];
  }
  return total < 0;
}
function onSameSide(a, b, c, d) {
  const px = d.x - c.x, py = d.y - c.y;
  const l = px * (a.y - c.y) - py * (a.x - c.x);
  const m = px * (b.y - c.y) - py * (b.x - c.x);
  return l * m >= 0;
}
function pointInTriangle(p, a, b, c) {
  return onSameSide(p, a, b, c) && onSameSide(p, b, a, c) && onSameSide(p, c, a, b);
}
function someInTriangle(vertices, a, b, c) {
  for (const p of vertices) {
    if (p !== a && p !== b && p !== c && pointInTriangle(p, a, b, c)) {
      return true;
    }
  }
  return false;
}
function isEar(a, b, c, vertices) {
  return isOrientedCcw(a, b, c) && !someInTriangle(vertices, a, b, c);
}
function triangulate(pts) {
  if (pts.length < 3) {
    return [];
  }
  if (pts.length == 3) {
    return [pts];
  }
  let nextIdx = [];
  let prevIdx = [];
  let idx = 0;
  for (let i = 0; i < pts.length; i++) {
    const lm = pts[idx];
    const pt = pts[i];
    if (pt.x < lm.x || pt.x == lm.x && pt.y < lm.y) {
      idx = idx;
    }
    nextIdx[i] = i + 1;
    prevIdx[i] = i - 1;
  }
  nextIdx[nextIdx.length - 1] = 0;
  prevIdx[0] = prevIdx.length - 1;
  if (!isOrientedCcwPolygon(pts)) {
    [nextIdx, prevIdx] = [prevIdx, nextIdx];
  }
  const concaveVertices = [];
  for (let i = 0; i < pts.length; ++i) {
    if (!isOrientedCcw(pts[prevIdx[i]], pts[i], pts[nextIdx[i]])) {
      concaveVertices.push(pts[i]);
    }
  }
  const triangles = [];
  let nVertices = pts.length;
  let current = 1;
  let skipped = 0;
  let next;
  let prev;
  while (nVertices > 3) {
    next = nextIdx[current];
    prev = prevIdx[current];
    const a = pts[prev];
    const b = pts[current];
    const c = pts[next];
    if (isEar(a, b, c, concaveVertices)) {
      triangles.push([a, b, c]);
      nextIdx[prev] = next;
      prevIdx[next] = prev;
      concaveVertices.splice(concaveVertices.indexOf(b), 1);
      --nVertices;
      skipped = 0;
    } else if (++skipped > nVertices) {
      return [];
    }
    current = next;
  }
  next = nextIdx[current];
  prev = prevIdx[current];
  triangles.push([pts[prev], pts[current], pts[next]]);
  return triangles;
}
function isConvex(pts) {
  if (pts.length < 3) {
    return false;
  }
  let i = pts.length - 2;
  let j = pts.length - 1;
  let k5 = 0;
  let p = pts[j].sub(pts[i]);
  let q = pts[k5].sub(pts[j]);
  let winding = p.cross(q);
  while (k5 + 1 < pts.length) {
    i = j;
    j = k5;
    k5++;
    p = pts[j].sub(pts[i]);
    q = pts[k5].sub(pts[j]);
    if (p.cross(q) * winding < 0) {
      return false;
    }
  }
  return true;
}

// src/utils/asserts.ts
var arrayIsColor = (arr) => {
  return arr[0] instanceof Color;
};
var arrayIsVec2 = (arr) => {
  return arr[0] instanceof Vec2;
};
var arrayIsNumber = (arr) => {
  return typeof arr[0] === "number";
};
function isClass(obj) {
  return obj?.prototype && Object.getOwnPropertyDescriptor(obj.prototype, "constructor") !== void 0;
}

// src/utils/binaryheap.ts
var BinaryHeap = class {
  _items;
  _compareFn;
  /**
   * Creates a binary heap with the given compare function
   * Not passing a compare function will give a min heap
   */
  constructor(compareFn = (a, b) => a < b) {
    this._compareFn = compareFn;
    this._items = [];
  }
  /**
   * Insert an item into the binary heap
   */
  insert(item) {
    this._items.push(item);
    this.moveUp(this._items.length - 1);
  }
  /**
   * Remove the smallest item from the binary heap in case of a min heap
   * or the greatest item from the binary heap in case of a max heap
   */
  remove() {
    if (this._items.length === 0) {
      return null;
    }
    const item = this._items[0];
    const lastItem = this._items.pop();
    if (this._items.length !== 0) {
      this._items[0] = lastItem;
      this.moveDown(0);
    }
    return item;
  }
  /**
   * Remove all items
   */
  clear() {
    this._items.splice(0, this._items.length);
  }
  moveUp(pos2) {
    while (pos2 > 0) {
      const parent = Math.floor((pos2 - 1) / 2);
      if (!this._compareFn(this._items[pos2], this._items[parent])) {
        if (this._items[pos2] >= this._items[parent]) {
          break;
        }
      }
      this.swap(pos2, parent);
      pos2 = parent;
    }
  }
  moveDown(pos2) {
    while (pos2 < Math.floor(this._items.length / 2)) {
      let child = 2 * pos2 + 1;
      if (child < this._items.length - 1 && !this._compareFn(this._items[child], this._items[child + 1])) {
        ++child;
      }
      if (this._compareFn(this._items[pos2], this._items[child])) {
        break;
      }
      this.swap(pos2, child);
      pos2 = child;
    }
  }
  swap(index1, index2) {
    [this._items[index1], this._items[index2]] = [
      this._items[index2],
      this._items[index1]
    ];
  }
  /**
   * Returns the amount of items
   */
  get length() {
    return this._items.length;
  }
};

// src/utils/dataURL.ts
function base64ToArrayBuffer(base64) {
  const binstr = window.atob(base64);
  const len = binstr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binstr.charCodeAt(i);
  }
  return bytes.buffer;
}
function dataURLToArrayBuffer(url) {
  return base64ToArrayBuffer(url.split(",")[1]);
}
function download(filename, url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
function downloadText(filename, text2) {
  download(filename, "data:text/plain;charset=utf-8," + text2);
}
function downloadJSON(filename, data) {
  downloadText(filename, JSON.stringify(data));
}
function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  download(filename, url);
  URL.revokeObjectURL(url);
}
var isDataURL = (str) => str.match(/^data:\w+\/\w+;base64,.+/);
var getFileName = (p) => p.split(".").slice(0, -1).join(".");

// src/utils/deepEq.ts
function deepEq(o1, o2) {
  if (o1 === o2) {
    return true;
  }
  const t1 = typeof o1;
  const t2 = typeof o2;
  if (t1 !== t2) {
    return false;
  }
  if (t1 === "object" && t2 === "object" && o1 !== null && o2 !== null) {
    if (Array.isArray(o1) !== Array.isArray(o2)) {
      return false;
    }
    const k1 = Object.keys(o1);
    const k22 = Object.keys(o2);
    if (k1.length !== k22.length) {
      return false;
    }
    for (const k5 of k1) {
      const v1 = o1[k5];
      const v2 = o2[k5];
      if (!deepEq(v1, v2)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

// src/utils/events.ts
var Registry = class extends Map {
  lastID = 0;
  push(v) {
    const id = this.lastID;
    this.set(id, v);
    this.lastID++;
    return id;
  }
  pushd(v) {
    const id = this.push(v);
    return () => this.delete(id);
  }
};
var KEventController = class _KEventController {
  /** If the event is paused */
  paused = false;
  /** Cancel the event */
  cancel;
  constructor(cancel) {
    this.cancel = cancel;
  }
  static join(events) {
    const ev = new _KEventController(
      () => events.forEach((e) => e.cancel())
    );
    Object.defineProperty(ev, "paused", {
      get: () => events[0].paused,
      set: (p) => events.forEach((e) => e.paused = p)
    });
    ev.paused = false;
    return ev;
  }
};
var KEvent = class {
  handlers = new Registry();
  add(action) {
    const cancel = this.handlers.pushd((...args) => {
      if (ev.paused) return;
      action(...args);
    });
    const ev = new KEventController(cancel);
    return ev;
  }
  addOnce(action) {
    const ev = this.add((...args) => {
      ev.cancel();
      action(...args);
    });
    return ev;
  }
  next() {
    return new Promise((res) => this.addOnce(res));
  }
  trigger(...args) {
    this.handlers.forEach((action) => action(...args));
  }
  numListeners() {
    return this.handlers.size;
  }
  clear() {
    this.handlers.clear();
  }
};
var KEventHandler = class {
  handlers = {};
  registers = {};
  on(name, action) {
    if (!this.handlers[name]) {
      this.handlers[name] = new KEvent();
    }
    return this.handlers[name].add(action);
  }
  onOnce(name, action) {
    const ev = this.on(name, (...args) => {
      ev.cancel();
      action(...args);
    });
    return ev;
  }
  next(name) {
    return new Promise((res) => {
      this.onOnce(name, (...args) => res(args[0]));
    });
  }
  trigger(name, ...args) {
    if (this.handlers[name]) {
      this.handlers[name].trigger(...args);
    }
  }
  remove(name) {
    delete this.handlers[name];
  }
  clear() {
    this.handlers = {};
  }
  numListeners(name) {
    return this.handlers[name]?.numListeners() ?? 0;
  }
};

// src/utils/log.ts
var getErrorMessage = (error) => error instanceof Error ? error.message : String(error);

// src/utils/numbers.ts
function toFixed(n, f) {
  return Number(n.toFixed(f));
}

// src/utils/overload.ts
function overload2(fn1, fn2) {
  return (...args) => {
    const al = args.length;
    if (al === fn1.length) return fn1(...args);
    if (al === fn2.length) return fn2(...args);
  };
}

// src/utils/runes.ts
var GRAPHEMES = Object.freeze([
  776,
  // ( ◌̈ ) COMBINING DIAERESIS
  2359,
  // ( ष ) DEVANAGARI LETTER SSA
  2367,
  // ( ि ) DEVANAGARI VOWEL SIGN I
  2984,
  // ( ந ) TAMIL LETTER NA
  3007,
  // ( ி ) TAMIL VOWEL SIGN I
  3021,
  // ( ◌்) TAMIL SIGN VIRAMA
  3633,
  // ( ◌ั ) THAI CHARACTER MAI HAN-AKAT
  3635,
  // ( ำ ) THAI CHARACTER SARA AM
  3648,
  // ( เ ) THAI CHARACTER SARA E
  3657,
  // ( เ ) THAI CHARACTER MAI THO
  4352,
  // ( ᄀ ) HANGUL CHOSEONG KIYEOK
  4449,
  // ( ᅡ ) HANGUL JUNGSEONG A
  4520
  // ( ᆨ ) HANGUL JONGSEONG KIYEOK
]);
function runes(string) {
  if (typeof string !== "string") {
    throw new TypeError("string cannot be undefined or null");
  }
  const result = [];
  let i = 0;
  let increment = 0;
  while (i < string.length) {
    increment += nextUnits(i + increment, string);
    if (isGrapheme(string[i + increment])) {
      increment++;
    }
    if (isVariationSelector(string[i + increment])) {
      increment++;
    }
    if (isDiacriticalMark(string[i + increment])) {
      increment++;
    }
    if (isZeroWidthJoiner(string[i + increment])) {
      increment++;
      continue;
    }
    result.push(string.substring(i, i + increment));
    i += increment;
    increment = 0;
  }
  return result;
}
function nextUnits(i, string) {
  const current = string[i];
  if (!isFirstOfSurrogatePair(current) || i === string.length - 1) {
    return 1 /* unit_1 */;
  }
  const currentPair = current + string[i + 1];
  const nextPair = string.substring(i + 2, i + 5);
  if (isRegionalIndicator(currentPair) && isRegionalIndicator(nextPair)) {
    return 4 /* unit_4 */;
  }
  if (isSubdivisionFlag(currentPair) && isSupplementarySpecialpurposePlane(nextPair)) {
    return string.slice(i).indexOf(
      String.fromCodePoint(917631 /* TAGS_END */)
    ) + 2;
  }
  if (isFitzpatrickModifier(nextPair)) {
    return 4 /* unit_4 */;
  }
  return 2 /* unit_2 */;
}
function isFirstOfSurrogatePair(string) {
  return string && betweenInclusive(
    string[0].charCodeAt(0),
    55296 /* HIGH_SURROGATE_START */,
    56319 /* HIGH_SURROGATE_END */
  );
}
function isRegionalIndicator(string) {
  return betweenInclusive(
    codePointFromSurrogatePair(string),
    127462 /* REGIONAL_INDICATOR_START */,
    127487 /* REGIONAL_INDICATOR_END */
  );
}
function isSubdivisionFlag(string) {
  return betweenInclusive(
    codePointFromSurrogatePair(string),
    127988 /* SUBDIVISION_INDICATOR_START */,
    127988 /* SUBDIVISION_INDICATOR_START */
  );
}
function isFitzpatrickModifier(string) {
  return betweenInclusive(
    codePointFromSurrogatePair(string),
    127995 /* FITZPATRICK_MODIFIER_START */,
    127999 /* FITZPATRICK_MODIFIER_END */
  );
}
function isVariationSelector(string) {
  return typeof string === "string" && betweenInclusive(
    string.charCodeAt(0),
    65024 /* VARIATION_MODIFIER_START */,
    65039 /* VARIATION_MODIFIER_END */
  );
}
function isDiacriticalMark(string) {
  return typeof string === "string" && betweenInclusive(
    string.charCodeAt(0),
    8400 /* DIACRITICAL_MARKS_START */,
    8447 /* DIACRITICAL_MARKS_END */
  );
}
function isSupplementarySpecialpurposePlane(string) {
  const codePoint = string.codePointAt(0);
  return typeof string === "string" && typeof codePoint === "number" && betweenInclusive(
    codePoint,
    917504 /* TAGS_START */,
    917631 /* TAGS_END */
  );
}
function isGrapheme(string) {
  return typeof string === "string" && GRAPHEMES.includes(string.charCodeAt(0));
}
function isZeroWidthJoiner(string) {
  return typeof string === "string" && string.charCodeAt(0) === 8205 /* ZWJ */;
}
function codePointFromSurrogatePair(pair) {
  const highOffset = pair.charCodeAt(0) - 55296 /* HIGH_SURROGATE_START */;
  const lowOffset = pair.charCodeAt(1) - 56320 /* LOW_SURROGATE_START */;
  return (highOffset << 10) + lowOffset + 65536;
}
function betweenInclusive(value, lower, upper) {
  return value >= lower && value <= upper;
}

// src/utils/sets.ts
var isEqOrIncludes = (listOrSmt, el) => {
  if (Array.isArray(listOrSmt)) {
    return listOrSmt?.includes(el);
  }
  return listOrSmt === el;
};
var setHasOrIncludes = (set, key) => {
  if (Array.isArray(key)) {
    return key.some((k5) => set.has(k5));
  }
  return set.has(key);
};
var mapAddOrPush = (map2, key, value) => {
  if (map2.has(key)) {
    map2.get(key)?.push(value);
  } else {
    map2.set(key, [value]);
  }
};

// src/utils/uid.ts
var uid = /* @__PURE__ */ (() => {
  let id = 0;
  return () => id++;
})();

// src/data/gamepad.json
var gamepad_default = {
  "Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)": {
    buttons: {
      "0": "south",
      "1": "east",
      "2": "west",
      "3": "north",
      "4": "lshoulder",
      "5": "rshoulder",
      "6": "ltrigger",
      "7": "rtrigger",
      "8": "select",
      "9": "start",
      "10": "lstick",
      "11": "rstick",
      "12": "dpad-up",
      "13": "dpad-down",
      "14": "dpad-left",
      "15": "dpad-right",
      "16": "home",
      "17": "capture"
    },
    sticks: {
      left: { x: 0, y: 1 },
      right: { x: 2, y: 3 }
    }
  },
  "Joy-Con (L) (STANDARD GAMEPAD Vendor: 057e Product: 2006)": {
    buttons: {
      "0": "south",
      "1": "east",
      "2": "west",
      "3": "north",
      "4": "lshoulder",
      "5": "rshoulder",
      "9": "select",
      "10": "lstick",
      "16": "start"
    },
    sticks: {
      left: { x: 0, y: 1 }
    }
  },
  "Joy-Con (R) (STANDARD GAMEPAD Vendor: 057e Product: 2007)": {
    buttons: {
      "0": "south",
      "1": "east",
      "2": "west",
      "3": "north",
      "4": "lshoulder",
      "5": "rshoulder",
      "9": "start",
      "10": "lstick",
      "16": "select"
    },
    sticks: {
      left: { x: 0, y: 1 }
    }
  },
  "Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)": {
    buttons: {
      "0": "south",
      "1": "east",
      "2": "west",
      "3": "north",
      "4": "lshoulder",
      "5": "rshoulder",
      "6": "ltrigger",
      "7": "rtrigger",
      "8": "select",
      "9": "start",
      "10": "lstick",
      "11": "rstick",
      "12": "dpad-up",
      "13": "dpad-down",
      "14": "dpad-left",
      "15": "dpad-right",
      "16": "home",
      "17": "capture"
    },
    sticks: {
      left: { x: 0, y: 1 },
      right: { x: 2, y: 3 }
    }
  },
  default: {
    buttons: {
      "0": "south",
      "1": "east",
      "2": "west",
      "3": "north",
      "4": "lshoulder",
      "5": "rshoulder",
      "6": "ltrigger",
      "7": "rtrigger",
      "8": "select",
      "9": "start",
      "10": "lstick",
      "11": "rstick",
      "12": "dpad-up",
      "13": "dpad-down",
      "14": "dpad-left",
      "15": "dpad-right",
      "16": "home"
    },
    sticks: {
      left: { x: 0, y: 1 },
      right: { x: 2, y: 3 }
    }
  }
};

// src/app/inputBindings.ts
var getLastInputDeviceType = () => {
  return appState.lastInputDevice;
};
var parseButtonBindings = () => {
  const btns = appState.buttons;
  for (const b in btns) {
    const keyboardBtns = btns[b].keyboard && [btns[b].keyboard].flat();
    const keyboardCodes = btns[b].keyboardCode && [btns[b].keyboardCode].flat();
    const gamepadBtns = btns[b].gamepad && [btns[b].gamepad].flat();
    const mouseBtns = btns[b].mouse && [btns[b].mouse].flat();
    if (keyboardBtns) {
      keyboardBtns.forEach((k5) => {
        mapAddOrPush(appState.buttonsByKey, k5, b);
      });
    }
    if (keyboardCodes) {
      keyboardCodes.forEach((k5) => {
        mapAddOrPush(appState.buttonsByKeyCode, k5, b);
      });
    }
    if (gamepadBtns) {
      gamepadBtns.forEach((g) => {
        mapAddOrPush(appState.buttonsByGamepad, g, b);
      });
    }
    if (mouseBtns) {
      mouseBtns.forEach((m) => {
        mapAddOrPush(appState.buttonsByMouse, m, b);
      });
    }
  }
};

// src/app/app.ts
var ButtonState = class {
  pressed = /* @__PURE__ */ new Set([]);
  pressedRepeat = /* @__PURE__ */ new Set([]);
  released = /* @__PURE__ */ new Set([]);
  down = /* @__PURE__ */ new Set([]);
  update() {
    this.pressed.clear();
    this.released.clear();
    this.pressedRepeat.clear();
  }
  press(btn) {
    this.pressed.add(btn);
    this.pressedRepeat.add(btn);
    this.down.add(btn);
  }
  pressRepeat(btn) {
    this.pressedRepeat.add(btn);
  }
  release(btn) {
    this.down.delete(btn);
    this.pressed.delete(btn);
    this.released.add(btn);
  }
};
var GamepadState = class {
  buttonState = new ButtonState();
  stickState = /* @__PURE__ */ new Map();
};
var FPSCounter = class {
  dts = [];
  timer = 0;
  fps = 0;
  tick(dt2) {
    this.dts.push(dt2);
    this.timer += dt2;
    if (this.timer >= 1) {
      this.timer = 0;
      this.fps = Math.round(
        1 / (this.dts.reduce((a, b) => a + b) / this.dts.length)
      );
      this.dts = [];
    }
  }
};
var appState;
var initAppState = (opt) => {
  const buttons = opt.buttons ?? {};
  return {
    canvas: opt.canvas,
    buttons,
    buttonsByKey: /* @__PURE__ */ new Map(),
    buttonsByMouse: /* @__PURE__ */ new Map(),
    buttonsByGamepad: /* @__PURE__ */ new Map(),
    buttonsByKeyCode: /* @__PURE__ */ new Map(),
    loopID: null,
    stopped: false,
    dt: 0,
    fixedDt: 1 / 50,
    restDt: 0,
    time: 0,
    realTime: 0,
    fpsCounter: new FPSCounter(),
    timeScale: 1,
    skipTime: false,
    isHidden: false,
    numFrames: 0,
    mousePos: new Vec2(0),
    mouseDeltaPos: new Vec2(0),
    keyState: new ButtonState(),
    mouseState: new ButtonState(),
    mergedGamepadState: new GamepadState(),
    gamepadStates: /* @__PURE__ */ new Map(),
    lastInputDevice: null,
    // unified input state
    buttonState: new ButtonState(),
    gamepads: [],
    charInputted: [],
    isMouseMoved: false,
    lastWidth: opt.canvas.offsetWidth,
    lastHeight: opt.canvas.offsetHeight,
    events: new KEventHandler()
  };
};
var initApp = (opt) => {
  if (!opt.canvas) {
    throw new Error("Please provide a canvas");
  }
  const state2 = initAppState(opt);
  appState = state2;
  parseButtonBindings();
  function dt2() {
    return state2.dt * state2.timeScale;
  }
  function fixedDt3() {
    return state2.fixedDt * state2.timeScale;
  }
  function restDt2() {
    return state2.restDt * state2.timeScale;
  }
  function isHidden() {
    return state2.isHidden;
  }
  function time() {
    return state2.time;
  }
  function fps() {
    return state2.fpsCounter.fps;
  }
  function numFrames() {
    return state2.numFrames;
  }
  function screenshot() {
    return state2.canvas.toDataURL();
  }
  function setCursor(c) {
    state2.canvas.style.cursor = c;
  }
  function getCursor() {
    return state2.canvas.style.cursor;
  }
  function setCursorLocked(b) {
    if (b) {
      try {
        const res = state2.canvas.requestPointerLock();
        if (res.catch) {
          res.catch((e) => console.error(e));
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      document.exitPointerLock();
    }
  }
  function isCursorLocked() {
    return !!document.pointerLockElement;
  }
  function enterFullscreen(el) {
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }
  function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullScreen) document.webkitExitFullScreen();
  }
  function setFullscreen(f = true) {
    if (f) {
      enterFullscreen(state2.canvas);
    } else {
      exitFullscreen();
    }
  }
  function isFullscreen() {
    return document.fullscreenElement === state2.canvas || document.webkitFullscreenElement === state2.canvas;
  }
  function quit() {
    state2.stopped = true;
    const ce = Object.entries(canvasEvents);
    const de = Object.entries(docEvents);
    const we = Object.entries(winEvents);
    for (const [name, val] of ce) {
      state2.canvas.removeEventListener(name, val);
    }
    for (const [name, val] of de) {
      document.removeEventListener(name, val);
    }
    for (const [name, val] of we) {
      window.removeEventListener(name, val);
    }
    resizeObserver.disconnect();
  }
  function run(fixedUpdate, update) {
    if (state2.loopID !== null) {
      cancelAnimationFrame(state2.loopID);
    }
    let fixedAccumulatedDt = 0;
    let accumulatedDt = 0;
    const frame = (t) => {
      if (state2.stopped) return;
      if (document.visibilityState !== "visible") {
        state2.loopID = requestAnimationFrame(frame);
        return;
      }
      const loopTime = t / 1e3;
      const realDt = Math.min(loopTime - state2.realTime, 0.25);
      const desiredDt = opt.maxFPS ? 1 / opt.maxFPS : 0;
      state2.realTime = loopTime;
      accumulatedDt += realDt;
      if (accumulatedDt > desiredDt) {
        if (!state2.skipTime) {
          fixedAccumulatedDt += accumulatedDt;
          state2.dt = state2.fixedDt;
          state2.restDt = 0;
          while (fixedAccumulatedDt > state2.fixedDt) {
            fixedAccumulatedDt -= state2.fixedDt;
            if (fixedAccumulatedDt < state2.fixedDt) {
              state2.restDt = fixedAccumulatedDt;
            }
            fixedUpdate();
          }
          state2.restDt = fixedAccumulatedDt;
          state2.dt = accumulatedDt;
          state2.time += dt2();
          state2.fpsCounter.tick(state2.dt);
        }
        accumulatedDt = 0;
        state2.skipTime = false;
        state2.numFrames++;
        update(processInput, resetInput);
      }
      state2.loopID = requestAnimationFrame(frame);
    };
    frame(0);
  }
  function isTouchscreen() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }
  function mousePos2() {
    return state2.mousePos.clone();
  }
  function mouseDeltaPos() {
    return state2.mouseDeltaPos.clone();
  }
  function isMousePressed(m = "left") {
    return state2.mouseState.pressed.has(m);
  }
  function isMouseDown(m = "left") {
    return state2.mouseState.down.has(m);
  }
  function isMouseReleased(m = "left") {
    return state2.mouseState.released.has(m);
  }
  function isMouseMoved() {
    return state2.isMouseMoved;
  }
  function isKeyPressed(k5) {
    return k5 === void 0 ? state2.keyState.pressed.size > 0 : setHasOrIncludes(state2.keyState.pressed, k5);
  }
  function isKeyPressedRepeat(k5) {
    return k5 === void 0 ? state2.keyState.pressedRepeat.size > 0 : setHasOrIncludes(state2.keyState.pressedRepeat, k5);
  }
  function isKeyDown(k5) {
    return k5 === void 0 ? state2.keyState.down.size > 0 : setHasOrIncludes(state2.keyState.down, k5);
  }
  function isKeyReleased(k5) {
    return k5 === void 0 ? state2.keyState.released.size > 0 : setHasOrIncludes(state2.keyState.released, k5);
  }
  function isGamepadButtonPressed(btn) {
    return btn === void 0 ? state2.mergedGamepadState.buttonState.pressed.size > 0 : setHasOrIncludes(
      state2.mergedGamepadState.buttonState.pressed,
      btn
    );
  }
  function isGamepadButtonDown(btn) {
    return btn === void 0 ? state2.mergedGamepadState.buttonState.down.size > 0 : setHasOrIncludes(state2.mergedGamepadState.buttonState.down, btn);
  }
  function isGamepadButtonReleased(btn) {
    return btn === void 0 ? state2.mergedGamepadState.buttonState.released.size > 0 : setHasOrIncludes(
      state2.mergedGamepadState.buttonState.released,
      btn
    );
  }
  function isButtonPressed(btn) {
    return btn === void 0 ? state2.buttonState.pressed.size > 0 : setHasOrIncludes(state2.buttonState.pressed, btn);
  }
  function isButtonDown(btn) {
    return btn === void 0 ? state2.buttonState.down.size > 0 : setHasOrIncludes(state2.buttonState.down, btn);
  }
  function isButtonReleased(btn) {
    return btn === void 0 ? state2.buttonState.released.size > 0 : setHasOrIncludes(state2.buttonState.released, btn);
  }
  function getButton(btn) {
    return state2.buttons?.[btn];
  }
  function setButton(btn, binding) {
    state2.buttons[btn] = {
      ...state2.buttons[btn],
      ...binding
    };
  }
  function onResize2(action) {
    return state2.events.on("resize", action);
  }
  const onKeyDown = overload2((action) => {
    return state2.events.on("keyDown", action);
  }, (key, action) => {
    return state2.events.on(
      "keyDown",
      (k5) => isEqOrIncludes(key, k5) && action(k5)
    );
  });
  const onKeyPress = overload2((action) => {
    return state2.events.on("keyPress", (k5) => action(k5));
  }, (key, action) => {
    return state2.events.on(
      "keyPress",
      (k5) => isEqOrIncludes(key, k5) && action(k5)
    );
  });
  const onKeyPressRepeat = overload2((action) => {
    return state2.events.on("keyPressRepeat", action);
  }, (key, action) => {
    return state2.events.on(
      "keyPressRepeat",
      (k5) => isEqOrIncludes(key, k5) && action(k5)
    );
  });
  const onKeyRelease = overload2((action) => {
    return state2.events.on("keyRelease", action);
  }, (key, action) => {
    return state2.events.on(
      "keyRelease",
      (k5) => isEqOrIncludes(key, k5) && action(k5)
    );
  });
  const onMouseDown = overload2((action) => {
    return state2.events.on("mouseDown", (m) => action(m));
  }, (mouse, action) => {
    return state2.events.on(
      "mouseDown",
      (m) => isEqOrIncludes(mouse, m) && action(m)
    );
  });
  const onMousePress = overload2((action) => {
    return state2.events.on("mousePress", (m) => action(m));
  }, (mouse, action) => {
    return state2.events.on(
      "mousePress",
      (m) => isEqOrIncludes(mouse, m) && action(m)
    );
  });
  const onMouseRelease = overload2((action) => {
    return state2.events.on("mouseRelease", (m) => action(m));
  }, (mouse, action) => {
    return state2.events.on("mouseRelease", (m) => m === mouse && action(m));
  });
  function onMouseMove(f) {
    return state2.events.on(
      "mouseMove",
      () => f(mousePos2(), mouseDeltaPos())
    );
  }
  function onCharInput(action) {
    return state2.events.on("charInput", action);
  }
  function onTouchStart(f) {
    return state2.events.on("touchStart", f);
  }
  function onTouchMove(f) {
    return state2.events.on("touchMove", f);
  }
  function onTouchEnd(f) {
    return state2.events.on("touchEnd", f);
  }
  function onScroll(action) {
    return state2.events.on("scroll", action);
  }
  function onHide(action) {
    return state2.events.on("hide", action);
  }
  function onShow(action) {
    return state2.events.on("show", action);
  }
  const onGamepadButtonPress = overload2(
    (action) => {
      return state2.events.on(
        "gamepadButtonPress",
        (b, gp) => action(b, gp)
      );
    },
    (btn, action) => {
      return state2.events.on(
        "gamepadButtonPress",
        (b, gp) => isEqOrIncludes(btn, b) && action(b, gp)
      );
    }
  );
  const onGamepadButtonDown = overload2(
    (action) => {
      return state2.events.on(
        "gamepadButtonDown",
        (b, gp) => action(b, gp)
      );
    },
    (btn, action) => {
      return state2.events.on(
        "gamepadButtonDown",
        (b, gp) => isEqOrIncludes(btn, b) && action(b, gp)
      );
    }
  );
  const onGamepadButtonRelease = overload2(
    (action) => {
      return state2.events.on(
        "gamepadButtonRelease",
        (b, gp) => action(b, gp)
      );
    },
    (btn, action) => {
      return state2.events.on(
        "gamepadButtonRelease",
        (b, gp) => isEqOrIncludes(btn, b) && action(b, gp)
      );
    }
  );
  function onGamepadStick(stick, action) {
    return state2.events.on(
      "gamepadStick",
      (a, v, gp) => a === stick && action(v, gp)
    );
  }
  function onGamepadConnect(action) {
    state2.events.on("gamepadConnect", action);
  }
  function onGamepadDisconnect(action) {
    state2.events.on("gamepadDisconnect", action);
  }
  function getGamepadStick(stick) {
    return state2.mergedGamepadState.stickState.get(stick) || new Vec2(0);
  }
  function charInputted() {
    return [...state2.charInputted];
  }
  function getGamepads() {
    return [...state2.gamepads];
  }
  const onButtonPress = overload2((action) => {
    return state2.events.on("buttonPress", (b) => action(b));
  }, (btn, action) => {
    return state2.events.on(
      "buttonPress",
      (b) => isEqOrIncludes(btn, b) && action(b)
    );
  });
  const onButtonDown = overload2((action) => {
    return state2.events.on("buttonDown", (b) => action(b));
  }, (btn, action) => {
    return state2.events.on(
      "buttonDown",
      (b) => isEqOrIncludes(btn, b) && action(b)
    );
  });
  const onButtonRelease = overload2((action) => {
    return state2.events.on("buttonRelease", (b) => action(b));
  }, (btn, action) => {
    return state2.events.on(
      "buttonRelease",
      (b) => isEqOrIncludes(btn, b) && action(b)
    );
  });
  function processInput() {
    state2.events.trigger("input");
    state2.keyState.down.forEach((k5) => state2.events.trigger("keyDown", k5));
    state2.mouseState.down.forEach(
      (k5) => state2.events.trigger("mouseDown", k5)
    );
    state2.buttonState.down.forEach(
      (btn) => state2.events.trigger("buttonDown", btn)
    );
    processGamepad();
  }
  function resetInput() {
    state2.keyState.update();
    state2.mouseState.update();
    state2.buttonState.update();
    state2.mergedGamepadState.buttonState.update();
    state2.mergedGamepadState.stickState.forEach((v, k5) => {
      state2.mergedGamepadState.stickState.set(k5, new Vec2(0));
    });
    state2.charInputted = [];
    state2.isMouseMoved = false;
    state2.mouseDeltaPos = new Vec2(0);
    state2.gamepadStates.forEach((s) => {
      s.buttonState.update();
      s.stickState.forEach((v, k5) => {
        s.stickState.set(k5, new Vec2(0));
      });
    });
  }
  function registerGamepad(browserGamepad) {
    const gamepad = {
      index: browserGamepad.index,
      isPressed: (btn) => {
        return state2.gamepadStates.get(browserGamepad.index)?.buttonState.pressed.has(btn) || false;
      },
      isDown: (btn) => {
        return state2.gamepadStates.get(browserGamepad.index)?.buttonState.down.has(btn) || false;
      },
      isReleased: (btn) => {
        return state2.gamepadStates.get(browserGamepad.index)?.buttonState.released.has(btn) || false;
      },
      getStick: (stick) => {
        return state2.gamepadStates.get(browserGamepad.index)?.stickState.get(stick) || vec2();
      }
    };
    state2.gamepads.push(gamepad);
    state2.gamepadStates.set(browserGamepad.index, {
      buttonState: new ButtonState(),
      stickState: /* @__PURE__ */ new Map([
        ["left", new Vec2(0)],
        ["right", new Vec2(0)]
      ])
    });
    return gamepad;
  }
  function removeGamepad(gamepad) {
    state2.gamepads = state2.gamepads.filter(
      (g) => g.index !== gamepad.index
    );
    state2.gamepadStates.delete(gamepad.index);
  }
  function processGamepad() {
    for (const browserGamepad of navigator.getGamepads()) {
      if (browserGamepad && !state2.gamepadStates.has(
        browserGamepad.index
      )) {
        registerGamepad(browserGamepad);
      }
    }
    for (const gamepad of state2.gamepads) {
      const browserGamepad = navigator.getGamepads()[gamepad.index];
      if (!browserGamepad) continue;
      const customMap = opt.gamepads ?? {};
      const map2 = customMap[browserGamepad.id] ?? gamepad_default[browserGamepad.id] ?? gamepad_default["default"];
      const gamepadState = state2.gamepadStates.get(gamepad.index);
      if (!gamepadState) continue;
      for (let i = 0; i < browserGamepad.buttons.length; i++) {
        const gamepadBtn = map2.buttons[i];
        const browserGamepadBtn = browserGamepad.buttons[i];
        const isGamepadButtonBind = state2.buttonsByGamepad.has(
          gamepadBtn
        );
        if (browserGamepadBtn.pressed) {
          if (!gamepadState.buttonState.down.has(gamepadBtn)) {
            state2.lastInputDevice = "gamepad";
            if (isGamepadButtonBind) {
              state2.buttonsByGamepad.get(gamepadBtn)?.forEach(
                (btn) => {
                  state2.buttonState.press(btn);
                  state2.events.trigger("buttonPress", btn);
                }
              );
            }
            state2.mergedGamepadState.buttonState.press(gamepadBtn);
            gamepadState.buttonState.press(gamepadBtn);
            state2.events.trigger(
              "gamepadButtonPress",
              gamepadBtn,
              gamepad
            );
          }
          if (isGamepadButtonBind) {
            state2.buttonsByGamepad.get(gamepadBtn)?.forEach(
              (btn) => {
                state2.buttonState.press(btn);
                state2.events.trigger("buttonDown", btn);
              }
            );
          }
          state2.events.trigger(
            "gamepadButtonDown",
            gamepadBtn,
            gamepad
          );
        } else if (gamepadState.buttonState.down.has(gamepadBtn)) {
          if (isGamepadButtonBind) {
            state2.buttonsByGamepad.get(gamepadBtn)?.forEach(
              (btn) => {
                state2.buttonState.release(btn);
                state2.events.trigger("buttonRelease", btn);
              }
            );
          }
          state2.mergedGamepadState.buttonState.release(
            gamepadBtn
          );
          gamepadState.buttonState.release(gamepadBtn);
          state2.events.trigger(
            "gamepadButtonRelease",
            gamepadBtn,
            gamepad
          );
        }
      }
      for (const stickName in map2.sticks) {
        const stick = map2.sticks[stickName];
        if (!stick) continue;
        const value = new Vec2(
          browserGamepad.axes[stick.x],
          browserGamepad.axes[stick.y]
        );
        gamepadState.stickState.set(stickName, value);
        state2.mergedGamepadState.stickState.set(
          stickName,
          value
        );
        state2.events.trigger("gamepadStick", stickName, value, gamepad);
      }
    }
  }
  const canvasEvents = {};
  const docEvents = {};
  const winEvents = {};
  const pd = opt.pixelDensity || 1;
  canvasEvents.mousemove = (e) => {
    const mousePos3 = new Vec2(e.offsetX, e.offsetY);
    const mouseDeltaPos2 = new Vec2(e.movementX, e.movementY);
    if (isFullscreen()) {
      const cw = state2.canvas.width / pd;
      const ch = state2.canvas.height / pd;
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const rw = ww / wh;
      const rc = cw / ch;
      if (rw > rc) {
        const ratio = wh / ch;
        const offset = (ww - cw * ratio) / 2;
        mousePos3.x = map(e.offsetX - offset, 0, cw * ratio, 0, cw);
        mousePos3.y = map(e.offsetY, 0, ch * ratio, 0, ch);
      } else {
        const ratio = ww / cw;
        const offset = (wh - ch * ratio) / 2;
        mousePos3.x = map(e.offsetX, 0, cw * ratio, 0, cw);
        mousePos3.y = map(e.offsetY - offset, 0, ch * ratio, 0, ch);
      }
    }
    state2.events.onOnce("input", () => {
      state2.isMouseMoved = true;
      state2.mousePos = mousePos3;
      state2.mouseDeltaPos = mouseDeltaPos2;
      state2.events.trigger("mouseMove");
    });
  };
  const MOUSE_BUTTONS = [
    "left",
    "middle",
    "right",
    "back",
    "forward"
  ];
  canvasEvents.mousedown = (e) => {
    state2.events.onOnce("input", () => {
      const m = MOUSE_BUTTONS[e.button];
      if (!m) return;
      state2.lastInputDevice = "mouse";
      if (state2.buttonsByMouse.has(m)) {
        state2.buttonsByMouse.get(m)?.forEach((btn) => {
          state2.buttonState.press(btn);
          state2.events.trigger("buttonPress", btn);
        });
      }
      state2.mouseState.press(m);
      state2.events.trigger("mousePress", m);
    });
  };
  canvasEvents.mouseup = (e) => {
    state2.events.onOnce("input", () => {
      const m = MOUSE_BUTTONS[e.button];
      if (!m) return;
      if (state2.buttonsByMouse.has(m)) {
        state2.buttonsByMouse.get(m)?.forEach((btn) => {
          state2.buttonState.release(btn);
          state2.events.trigger("buttonRelease", btn);
        });
      }
      state2.mouseState.release(m);
      state2.events.trigger("mouseRelease", m);
    });
  };
  const PREVENT_DEFAULT_KEYS = /* @__PURE__ */ new Set([
    " ",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Tab"
  ]);
  const KEY_ALIAS = {
    "ArrowLeft": "left",
    "ArrowRight": "right",
    "ArrowUp": "up",
    "ArrowDown": "down",
    " ": "space"
  };
  canvasEvents.keydown = (e) => {
    if (PREVENT_DEFAULT_KEYS.has(e.key)) {
      e.preventDefault();
    }
    state2.events.onOnce("input", () => {
      const k5 = KEY_ALIAS[e.key] || e.key.toLowerCase();
      const code = e.code;
      if (k5 === void 0) throw new Error(`Unknown key: ${e.key}`);
      if (k5.length === 1) {
        state2.events.trigger("charInput", k5);
        state2.charInputted.push(k5);
      } else if (k5 === "space") {
        state2.events.trigger("charInput", " ");
        state2.charInputted.push(" ");
      }
      if (e.repeat) {
        state2.keyState.pressRepeat(k5);
        state2.events.trigger("keyPressRepeat", k5);
      } else {
        state2.lastInputDevice = "keyboard";
        if (state2.buttonsByKey.has(k5)) {
          state2.buttonsByKey.get(k5)?.forEach((btn) => {
            state2.buttonState.press(btn);
            state2.events.trigger("buttonPress", btn);
          });
        }
        if (state2.buttonsByKeyCode.has(code)) {
          state2.buttonsByKeyCode.get(code)?.forEach((btn) => {
            state2.buttonState.press(btn);
            state2.events.trigger("buttonPress", btn);
          });
        }
        state2.keyState.press(k5);
        state2.events.trigger("keyPressRepeat", k5);
        state2.events.trigger("keyPress", k5);
      }
    });
  };
  canvasEvents.keyup = (e) => {
    state2.events.onOnce("input", () => {
      const k5 = KEY_ALIAS[e.key] || e.key.toLowerCase();
      const code = e.code;
      if (state2.buttonsByKey.has(k5)) {
        state2.buttonsByKey.get(k5)?.forEach((btn) => {
          state2.buttonState.release(btn);
          state2.events.trigger("buttonRelease", btn);
        });
      }
      if (state2.buttonsByKeyCode.has(code)) {
        state2.buttonsByKeyCode.get(code)?.forEach((btn) => {
          state2.buttonState.release(btn);
          state2.events.trigger("buttonRelease", btn);
        });
      }
      state2.keyState.release(k5);
      state2.events.trigger("keyRelease", k5);
    });
  };
  canvasEvents.touchstart = (e) => {
    e.preventDefault();
    state2.events.onOnce("input", () => {
      const touches = [...e.changedTouches];
      const box = state2.canvas.getBoundingClientRect();
      if (opt.touchToMouse !== false) {
        state2.mousePos = new Vec2(
          touches[0].clientX - box.x,
          touches[0].clientY - box.y
        );
        state2.lastInputDevice = "mouse";
        if (state2.buttonsByMouse.has("left")) {
          state2.buttonsByMouse.get("left")?.forEach((btn) => {
            state2.buttonState.press(btn);
            state2.events.trigger("buttonPress", btn);
          });
        }
        state2.mouseState.press("left");
        state2.events.trigger("mousePress", "left");
      }
      touches.forEach((t) => {
        state2.events.trigger(
          "touchStart",
          new Vec2(t.clientX - box.x, t.clientY - box.y),
          t
        );
      });
    });
  };
  canvasEvents.touchmove = (e) => {
    e.preventDefault();
    state2.events.onOnce("input", () => {
      const touches = [...e.changedTouches];
      const box = state2.canvas.getBoundingClientRect();
      if (opt.touchToMouse !== false) {
        const lastMousePos = state2.mousePos;
        state2.mousePos = new Vec2(
          touches[0].clientX - box.x,
          touches[0].clientY - box.y
        );
        state2.mouseDeltaPos = state2.mousePos.sub(lastMousePos);
        state2.events.trigger("mouseMove");
      }
      touches.forEach((t) => {
        state2.events.trigger(
          "touchMove",
          new Vec2(t.clientX - box.x, t.clientY - box.y),
          t
        );
      });
    });
  };
  canvasEvents.touchend = (e) => {
    state2.events.onOnce("input", () => {
      const touches = [...e.changedTouches];
      const box = state2.canvas.getBoundingClientRect();
      if (opt.touchToMouse !== false) {
        state2.mousePos = new Vec2(
          touches[0].clientX - box.x,
          touches[0].clientY - box.y
        );
        state2.mouseDeltaPos = new Vec2(0, 0);
        if (state2.buttonsByMouse.has("left")) {
          state2.buttonsByMouse.get("left")?.forEach((btn) => {
            state2.buttonState.release(btn);
            state2.events.trigger("buttonRelease", btn);
          });
        }
        state2.mouseState.release("left");
        state2.events.trigger("mouseRelease", "left");
      }
      touches.forEach((t) => {
        state2.events.trigger(
          "touchEnd",
          new Vec2(t.clientX - box.x, t.clientY - box.y),
          t
        );
      });
    });
  };
  canvasEvents.touchcancel = (e) => {
    state2.events.onOnce("input", () => {
      const touches = [...e.changedTouches];
      const box = state2.canvas.getBoundingClientRect();
      if (opt.touchToMouse !== false) {
        state2.mousePos = new Vec2(
          touches[0].clientX - box.x,
          touches[0].clientY - box.y
        );
        state2.mouseState.release("left");
        state2.events.trigger("mouseRelease", "left");
      }
      touches.forEach((t) => {
        state2.events.trigger(
          "touchEnd",
          new Vec2(t.clientX - box.x, t.clientY - box.y),
          t
        );
      });
    });
  };
  canvasEvents.wheel = (e) => {
    e.preventDefault();
    state2.events.onOnce("input", () => {
      state2.events.trigger("scroll", new Vec2(e.deltaX, e.deltaY));
    });
  };
  canvasEvents.contextmenu = (e) => e.preventDefault();
  docEvents.visibilitychange = () => {
    if (document.visibilityState === "visible") {
      state2.skipTime = true;
      state2.isHidden = false;
      state2.events.trigger("show");
    } else {
      state2.isHidden = true;
      state2.events.trigger("hide");
    }
  };
  winEvents.gamepadconnected = (e) => {
    const kbGamepad = registerGamepad(e.gamepad);
    state2.events.onOnce("input", () => {
      state2.events.trigger("gamepadConnect", kbGamepad);
    });
  };
  winEvents.gamepaddisconnected = (e) => {
    const kbGamepad = getGamepads().filter((g) => g.index === e.gamepad.index)[0];
    removeGamepad(e.gamepad);
    state2.events.onOnce("input", () => {
      state2.events.trigger("gamepadDisconnect", kbGamepad);
    });
  };
  for (const [name, val] of Object.entries(canvasEvents)) {
    state2.canvas.addEventListener(
      name,
      val
    );
  }
  for (const [name, val] of Object.entries(docEvents)) {
    document.addEventListener(
      name,
      val
    );
  }
  for (const [name, val] of Object.entries(winEvents)) {
    window.addEventListener(
      name,
      val
    );
  }
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target !== state2.canvas) continue;
      if (state2.lastWidth === state2.canvas.offsetWidth && state2.lastHeight === state2.canvas.offsetHeight) return;
      state2.lastWidth = state2.canvas.offsetWidth;
      state2.lastHeight = state2.canvas.offsetHeight;
      state2.events.onOnce("input", () => {
        state2.events.trigger("resize");
      });
    }
  });
  resizeObserver.observe(state2.canvas);
  return {
    dt: dt2,
    fixedDt: fixedDt3,
    restDt: restDt2,
    time,
    run,
    canvas: state2.canvas,
    fps,
    numFrames,
    quit,
    isHidden,
    setFullscreen,
    isFullscreen,
    setCursor,
    screenshot,
    getGamepads,
    getCursor,
    setCursorLocked,
    isCursorLocked,
    isTouchscreen,
    mousePos: mousePos2,
    mouseDeltaPos,
    isKeyDown,
    isKeyPressed,
    isKeyPressedRepeat,
    isKeyReleased,
    isMouseDown,
    isMousePressed,
    isMouseReleased,
    isMouseMoved,
    isGamepadButtonPressed,
    isGamepadButtonDown,
    isGamepadButtonReleased,
    getGamepadStick,
    isButtonPressed,
    isButtonDown,
    isButtonReleased,
    setButton,
    getButton,
    charInputted,
    onResize: onResize2,
    onKeyDown,
    onKeyPress,
    onKeyPressRepeat,
    onKeyRelease,
    onMouseDown,
    onMousePress,
    onMouseRelease,
    onMouseMove,
    onCharInput,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onScroll,
    onHide,
    onShow,
    onGamepadButtonDown,
    onGamepadButtonPress,
    onGamepadButtonRelease,
    onGamepadStick,
    onGamepadConnect,
    onGamepadDisconnect,
    onButtonPress,
    onButtonDown,
    onButtonRelease,
    getLastInputDeviceType,
    events: state2.events
  };
};

// src/app/frame.ts
function dt() {
  return app.dt() * debug.timeScale;
}
function fixedDt() {
  return app.fixedDt() * debug.timeScale;
}
function restDt() {
  return app.restDt() * debug.timeScale;
}

// src/gfx/anchor.ts
function anchorPt(orig) {
  switch (orig) {
    case "topleft":
      return new Vec2(-1, -1);
    case "top":
      return new Vec2(0, -1);
    case "topright":
      return new Vec2(1, -1);
    case "left":
      return new Vec2(-1, 0);
    case "center":
      return new Vec2(0, 0);
    case "right":
      return new Vec2(1, 0);
    case "botleft":
      return new Vec2(-1, 1);
    case "bot":
      return new Vec2(0, 1);
    case "botright":
      return new Vec2(1, 1);
    default:
      return orig;
  }
}
function alignPt(align) {
  switch (align) {
    case "left":
      return 0;
    case "center":
      return 0.5;
    case "right":
      return 1;
    default:
      return 0;
  }
}
function createEmptyAudioBuffer(ctx) {
  return ctx.createBuffer(1, 1, 44100);
}

// src/math/easings.ts
var c1 = 1.70158;
var c2 = c1 * 1.525;
var c3 = c1 + 1;
var c4 = 2 * Math.PI / 3;
var c5 = 2 * Math.PI / 4.5;
var easings = {
  linear: (x) => x,
  easeInSine: (x) => 1 - Math.cos(x * Math.PI / 2),
  easeOutSine: (x) => Math.sin(x * Math.PI / 2),
  easeInOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  easeInQuad: (x) => x * x,
  easeOutQuad: (x) => 1 - (1 - x) * (1 - x),
  easeInOutQuad: (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
  easeInCubic: (x) => x * x * x,
  easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
  easeInOutCubic: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  easeInQuart: (x) => x * x * x * x,
  easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
  easeInOutQuart: (x) => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
  easeInQuint: (x) => x * x * x * x * x,
  easeOutQuint: (x) => 1 - Math.pow(1 - x, 5),
  easeInOutQuint: (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,
  easeInExpo: (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
  easeOutExpo: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
  easeInOutExpo: (x) => {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
  },
  easeInCirc: (x) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
  easeOutCirc: (x) => Math.sqrt(1 - Math.pow(x - 1, 2)),
  easeInOutCirc: (x) => {
    return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  },
  easeInBack: (x) => c3 * x * x * x - c1 * x * x,
  easeOutBack: (x) => 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2),
  easeInOutBack: (x) => {
    return x < 0.5 ? Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  },
  easeInElastic: (x) => {
    return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
  },
  easeOutElastic: (x) => {
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  },
  easeInOutElastic: (x) => {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5) / 2 + 1;
  },
  easeInBounce: (x) => 1 - easings.easeOutBounce(1 - x),
  easeOutBounce: (x) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  },
  easeInOutBounce: (x) => {
    return x < 0.5 ? (1 - easings.easeOutBounce(1 - 2 * x)) / 2 : (1 + easings.easeOutBounce(2 * x - 1)) / 2;
  }
};
var easings_default = easings;

// src/math/navigation.ts
function buildPath(start, goal, cameFrom) {
  const path = [];
  let node = goal;
  path.push(node);
  while (node !== start) {
    node = cameFrom.get(node);
    if (node == void 0) return null;
    path.push(node);
  }
  return path.reverse();
}
function aStarSearch(graph, start, goal) {
  const frontier = new BinaryHeap((a, b) => a.cost < b.cost);
  frontier.insert({ cost: 0, node: start });
  const cameFrom = /* @__PURE__ */ new Map();
  cameFrom.set(start, start);
  const costSoFar = /* @__PURE__ */ new Map();
  costSoFar.set(start, 0);
  while (frontier.length !== 0) {
    const current = frontier.remove()?.node;
    if (current === goal) {
      break;
    }
    const neighbours = graph.getNeighbours(current);
    for (let next of neighbours) {
      const newCost = (costSoFar.get(current) || 0) + graph.getCost(current, next) + graph.getHeuristic(next, goal);
      if (!costSoFar.has(next) || newCost < costSoFar.get(next)) {
        costSoFar.set(next, newCost);
        frontier.insert({ cost: newCost, node: next });
        cameFrom.set(next, current);
      }
    }
  }
  return buildPath(start, goal, cameFrom);
}

// src/math/navigationmesh.ts
var NavEdge = class {
  a;
  b;
  polygon;
  constructor(a, b, polygon2) {
    this.a = a;
    this.b = b;
    this.polygon = new WeakRef(polygon2);
  }
  isLeft(x, y) {
    return (this.b.x - this.a.x) * (y - this.a.y) - (x - this.a.x) * (this.b.y - this.a.y);
  }
  get middle() {
    return this.a.add(this.b).scale(0.5);
  }
};
var NavPolygon = class {
  // I don't know if set a default affects how the code is did
  // TODO: Remove non-null assertion
  _edges;
  _centroid;
  _id;
  constructor(id) {
    this._id = id;
  }
  get id() {
    return this._id;
  }
  set edges(edges) {
    this._edges = edges;
    let centerX = 0;
    let centerY = 0;
    let area2 = 0;
    for (let edge of this._edges) {
      edge.polygon = new WeakRef(this);
      const cross = edge.a.x * edge.b.y - edge.a.y * edge.b.x;
      centerX += (edge.a.x + edge.b.x) * cross;
      centerY += (edge.a.y + edge.b.y) * cross;
      area2 += cross;
    }
    area2 /= 2;
    this._centroid = vec2(centerX / (6 * area2), centerY / (6 * area2));
  }
  get edges() {
    return this._edges;
  }
  get centroid() {
    return this._centroid;
  }
  // https://web.archive.org/web/20130126163405/http://geomalgorithms.com/a03-_inclusion.html
  /*contains(x: number, y: number) {
          let wn = 0;
  
          for (let edge of this._edges) {
              if (edge.a.y <= y) {
                  if (edge.b.y > y) {
                      if (edge.isLeft(x, y) > 0) {
                          ++wn;
                      }
                  }
              } else {
                  if (edge.b.y <= y) {
                      if (edge.isLeft(x, y) < 0) {
                          --wn;
                      }
                  }
              }
          }
          return wn;
      }*/
  contains(p) {
    let c = false;
    for (const e of this.edges) {
      if (e.b.y > p.y != e.a.y > p.y && p.x < (e.a.x - e.b.x) * (p.y - e.b.y) / (e.a.y - e.b.y) + e.b.x) {
        c = !c;
      }
    }
    return c;
  }
};
var NavMesh = class {
  _polygons;
  _pointCache;
  _edgeCache;
  constructor() {
    this._polygons = [];
    this._pointCache = {};
    this._edgeCache = {};
  }
  _addPoint(p) {
    let point = this._pointCache[`${p.x}_${p.y}`];
    if (point) {
      return point;
    }
    point = p.clone();
    this._pointCache[`${p.x}_${p.y}`] = point;
    return point;
  }
  _addEdge(edge) {
    const key = `${edge.a.x}_${edge.a.y}-${edge.b.x}_${edge.b.y}`;
    this._edgeCache[key] = edge;
    return edge;
  }
  _findEdge(a, b) {
    const key = `${a.x}_${a.y}-${b.x}_${b.y}`;
    return this._edgeCache[key];
  }
  _findCommonEdge(a, b) {
    for (const edge of a.edges) {
      const e = this._findEdge(edge.b, edge.a);
      if (e && e.polygon.deref().id === b.id) {
        return e;
      }
    }
    return null;
  }
  addPolygon(vertices) {
    const polygon2 = new NavPolygon(this._polygons.length);
    const edges = vertices.map(
      (v, index) => new NavEdge(v, vertices[(index + 1) % vertices.length], polygon2)
    );
    polygon2.edges = edges;
    this._polygons.push(polygon2);
    for (const edge of polygon2.edges) {
      this._addEdge(edge);
    }
    return polygon2;
  }
  addRect(pos2, size) {
    const a = this._addPoint(pos2);
    const b = this._addPoint(pos2.add(size.x, 0));
    const c = this._addPoint(pos2.add(size));
    const d = this._addPoint(pos2.add(0, size.y));
    return this.addPolygon([a, b, c, d]);
  }
  _getLocation(p) {
    for (let polygon2 of this._polygons) {
      if (polygon2.contains(p)) {
        return polygon2;
      }
    }
    return null;
  }
  getNeighbours(index) {
    const neighbours = [];
    for (let edge of this._polygons[index].edges) {
      const pairEdge = this._findEdge(edge.b, edge.a);
      if (pairEdge) {
        const pairPolygon = pairEdge.polygon.deref();
        if (pairPolygon) {
          neighbours.push(pairPolygon.id);
        }
      }
    }
    return neighbours;
  }
  getCost(a, b) {
    return 1;
  }
  getHeuristic(indexA, indexB) {
    const a = this._polygons[indexA];
    const b = this._polygons[indexB];
    const x = a.centroid.x - b.centroid.x;
    const y = a.centroid.y - b.centroid.y;
    return Math.sqrt(x * x + y * y);
  }
  getPath(start, goal) {
    if (start === void 0 || goal === void 0) {
      return [];
    }
    if (start === goal) {
      return [start, goal];
    }
    return aStarSearch(this, start, goal);
  }
  getWaypointPath(start, goal, opt) {
    const type = opt?.type || "centroids";
    const startPolygon = this._getLocation(start);
    const goalPolygon = this._getLocation(goal);
    if (startPolygon === void 0 || goalPolygon === void 0) {
      return [];
    }
    const path = this.getPath(startPolygon.id, goalPolygon.id);
    if (!path) {
      return [];
    }
    if (type === "edges") {
      const edges = [];
      for (let i = 1; i < path.length; i++) {
        const p1 = this._polygons[path[i - 1]];
        const p2 = this._polygons[path[i]];
        const edge = this._findCommonEdge(p1, p2);
        edges.push(
          edge.middle.add(
            p2.centroid.sub(edge.middle).unit().scale(4)
          )
        );
      }
      return [start, ...edges, goal];
    } else {
      return [
        start,
        ...path.slice(1, -1).map(
          (index) => this._polygons[index].centroid
        ),
        goal
      ];
    }
  }
};

// src/math/various.ts
function calcTransform(obj) {
  const tr = new Mat4();
  if (obj.pos) tr.translate(obj.pos);
  if (obj.scale) tr.scale(obj.scale);
  if (obj.angle) tr.rotate(obj.angle);
  return obj.parent ? tr.mult(obj.parent.transform) : tr;
}
function screen2ndc(pt) {
  return new Vec2(
    pt.x / width() * 2 - 1,
    -pt.y / height() * 2 + 1
  );
}
function getArcPts(pos2, radiusX, radiusY, start, end, res = 1) {
  start = deg2rad(start % 360);
  end = deg2rad(end % 360);
  if (end <= start) end += Math.PI * 2;
  const pts = [];
  const nverts = Math.ceil((end - start) / deg2rad(8) * res);
  const step = (end - start) / nverts;
  let v = vec2(Math.cos(start), Math.sin(start));
  const r = vec2(Math.cos(step), Math.sin(step));
  for (let i = 0; i <= nverts; i++) {
    pts.push(pos2.add(radiusX * v.x, radiusY * v.y));
    v = vec2(v.x * r.x - v.y * r.y, v.x * r.y + v.y * r.x);
  }
  return pts;
}

// src/gfx/bg.ts
function setBackground(...args) {
  const color2 = rgb(...args);
  const alpha = args[3] ?? 1;
  gfx.bgColor = color2;
  gfx.bgAlpha = alpha;
  gfx.ggl.gl.clearColor(
    color2.r / 255,
    color2.g / 255,
    color2.b / 255,
    alpha
  );
}
function getBackground() {
  return gfx.bgColor?.clone?.() ?? null;
}

// src/gfx/stack.ts
function pushTranslate(...args) {
  if (args[0] === void 0) return;
  const p = vec2(...args);
  if (p.x === 0 && p.y === 0) return;
  gfx.transform.translate(p);
}
function pushTransform() {
  gfx.transformStack.push(gfx.transform.clone());
}
function pushMatrix(m) {
  gfx.transform = m.clone();
}
function pushScale(...args) {
  if (args[0] === void 0) return;
  const p = vec2(...args);
  if (p.x === 1 && p.y === 1) return;
  gfx.transform.scale(p);
}
function pushRotate(a) {
  if (!a) return;
  gfx.transform.rotate(a);
}
function popTransform() {
  if (gfx.transformStack.length > 0) {
    gfx.transform = gfx.transformStack.pop();
  }
}
function flush() {
  gfx.renderer.flush();
}
function width() {
  return gfx.width;
}
function height() {
  return gfx.height;
}
function getViewportScale() {
  return (gfx.viewport.width + gfx.viewport.height) / (gfx.width + gfx.height);
}
function contentToView(pt) {
  return new Vec2(
    pt.x * gfx.viewport.width / gfx.width,
    pt.y * gfx.viewport.height / gfx.height
  );
}
function windowToContent(pt) {
  return new Vec2(
    (pt.x - gfx.viewport.x) * width() / gfx.viewport.width,
    (pt.y - gfx.viewport.y) * height() / gfx.viewport.height
  );
}
function mousePos() {
  return windowToContent(app.mousePos());
}
function center() {
  return vec2(width() / 2, height() / 2);
}

// src/constants.ts
var ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
var DEF_ANCHOR = "topleft";
var BG_GRID_SIZE = 64;
var DEF_FONT = "monospace";
var DBG_FONT = "monospace";
var DEF_TEXT_SIZE = 36;
var DEF_TEXT_CACHE_SIZE = 64;
var MAX_TEXT_CACHE_SIZE = 256;
var FONT_ATLAS_WIDTH = 2048;
var FONT_ATLAS_HEIGHT = 2048;
var SPRITE_ATLAS_WIDTH = 2048;
var SPRITE_ATLAS_HEIGHT = 2048;
var UV_PAD = 0.1;
var DEF_HASH_GRID_SIZE = 64;
var DEF_FONT_FILTER = "linear";
var LOG_MAX = 8;
var LOG_TIME = 4;
var VERTEX_FORMAT = [
  { name: "a_pos", size: 2 },
  { name: "a_uv", size: 2 },
  { name: "a_color", size: 4 }
];
var STRIDE = VERTEX_FORMAT.reduce((sum, f) => sum + f.size, 0);
var MAX_BATCHED_QUAD = 2048;
var MAX_BATCHED_VERTS = MAX_BATCHED_QUAD * 4 * STRIDE;
var MAX_BATCHED_INDICES = MAX_BATCHED_QUAD * 6;
var VERT_TEMPLATE = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 0.0, 1.0);
}

{{user}}

void main() {
	vec4 pos = vert(a_pos, a_uv, a_color);
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
`;
var FRAG_TEMPLATE = `
precision mediump float;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

{{user}}

void main() {
	gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`;
var DEF_VERT = `
vec4 vert(vec2 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`;
var DEF_FRAG = `
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`;
var COMP_DESC = /* @__PURE__ */ new Set(["id", "require"]);
var COMP_EVENTS = /* @__PURE__ */ new Set([
  "add",
  "fixedUpdate",
  "update",
  "draw",
  "destroy",
  "inspect",
  "drawInspect"
]);
var MULTI_WORD_RE = /^\w+$/;
var DEF_OFFSCREEN_DIS = 200;
var DEF_JUMP_FORCE = 640;
var MAX_VEL = 65536;

// src/gfx/texPacker.ts
var TexPacker = class {
  textures = [];
  bigTextures = [];
  canvas;
  c2d;
  x = 0;
  y = 0;
  curHeight = 0;
  gfx;
  constructor(gfx2, w, h) {
    this.gfx = gfx2;
    this.canvas = document.createElement("canvas");
    this.canvas.width = w;
    this.canvas.height = h;
    this.textures = [Texture.fromImage(gfx2, this.canvas)];
    this.bigTextures = [];
    const context2D = this.canvas.getContext("2d");
    if (!context2D) throw new Error("Failed to get 2d context");
    this.c2d = context2D;
  }
  add(img) {
    if (img.width > this.canvas.width || img.height > this.canvas.height) {
      const tex = Texture.fromImage(this.gfx, img);
      this.bigTextures.push(tex);
      return [tex, new Quad(0, 0, 1, 1)];
    }
    if (this.x + img.width > this.canvas.width) {
      this.x = 0;
      this.y += this.curHeight;
      this.curHeight = 0;
    }
    if (this.y + img.height > this.canvas.height) {
      this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.textures.push(Texture.fromImage(this.gfx, this.canvas));
      this.x = 0;
      this.y = 0;
      this.curHeight = 0;
    }
    const curTex = this.textures[this.textures.length - 1];
    const pos2 = new Vec2(this.x, this.y);
    this.x += img.width;
    if (img.height > this.curHeight) {
      this.curHeight = img.height;
    }
    if (img instanceof ImageData) {
      this.c2d.putImageData(img, pos2.x, pos2.y);
    } else {
      this.c2d.drawImage(img, pos2.x, pos2.y);
    }
    curTex.update(this.canvas);
    return [
      curTex,
      new Quad(
        pos2.x / this.canvas.width,
        pos2.y / this.canvas.height,
        img.width / this.canvas.width,
        img.height / this.canvas.height
      )
    ];
  }
  free() {
    for (const tex of this.textures) {
      tex.free();
    }
    for (const tex of this.bigTextures) {
      tex.free();
    }
  }
};

// src/assets/utils.ts
function fixURL(url) {
  if (typeof url !== "string" || isDataURL(url)) return url;
  return assets.urlPrefix + url;
}

// src/assets/asset.ts
var Asset = class _Asset {
  loaded = false;
  data = null;
  error = null;
  onLoadEvents = new KEvent();
  onErrorEvents = new KEvent();
  onFinishEvents = new KEvent();
  constructor(loader) {
    loader.then((data) => {
      this.loaded = true;
      this.data = data;
      this.onLoadEvents.trigger(data);
    }).catch((err) => {
      this.error = err;
      if (this.onErrorEvents.numListeners() > 0) {
        this.onErrorEvents.trigger(err);
      } else {
        throw err;
      }
    }).finally(() => {
      this.onFinishEvents.trigger();
      this.loaded = true;
    });
  }
  static loaded(data) {
    const asset = new _Asset(Promise.resolve(data));
    asset.data = data;
    asset.loaded = true;
    return asset;
  }
  onLoad(action) {
    if (this.loaded && this.data) {
      action(this.data);
    } else {
      this.onLoadEvents.add(action);
    }
    return this;
  }
  onError(action) {
    if (this.loaded && this.error) {
      action(this.error);
    } else {
      this.onErrorEvents.add(action);
    }
    return this;
  }
  onFinish(action) {
    if (this.loaded) {
      action();
    } else {
      this.onFinishEvents.add(action);
    }
    return this;
  }
  then(action) {
    return this.onLoad(action);
  }
  catch(action) {
    return this.onError(action);
  }
  finally(action) {
    return this.onFinish(action);
  }
};
var AssetBucket = class {
  assets = /* @__PURE__ */ new Map();
  lastUID = 0;
  add(name, loader) {
    const id = name ?? this.lastUID++ + "";
    const asset = new Asset(loader);
    this.assets.set(id, asset);
    return asset;
  }
  addLoaded(name, data) {
    const id = name ?? this.lastUID++ + "";
    const asset = Asset.loaded(data);
    this.assets.set(id, asset);
    return asset;
  }
  // if not found return undefined
  get(handle) {
    return this.assets.get(handle);
  }
  progress() {
    if (this.assets.size === 0) {
      return 1;
    }
    let loaded = 0;
    this.assets.forEach((asset) => {
      if (asset.loaded) {
        loaded++;
      }
    });
    return loaded / this.assets.size;
  }
};
function fetchURL(url) {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch "${url}"`);
    return res;
  });
}
function fetchJSON(path) {
  return fetchURL(path).then((res) => res.json());
}
function fetchText(path) {
  return fetchURL(path).then((res) => res.text());
}
function fetchArrayBuffer(path) {
  return fetchURL(path).then((res) => res.arrayBuffer());
}
function loadRoot(path) {
  if (path !== void 0) {
    assets.urlPrefix = path;
  }
  return assets.urlPrefix;
}
function loadJSON(name, url) {
  return assets.custom.add(name, fetchJSON(fixURL(url)));
}
function loadImg(src) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from "${src}"`));
  });
}
function loadProgress() {
  const buckets = [
    assets.sprites,
    assets.sounds,
    assets.shaders,
    assets.fonts,
    assets.bitmapFonts,
    assets.custom
  ];
  return buckets.reduce((n, bucket) => n + bucket.progress(), 0) / buckets.length;
}
function getAsset(name) {
  return assets.custom.get(name) ?? null;
}
function load(prom) {
  return assets.custom.add(null, prom);
}
var initAssets = (ggl) => {
  const assets2 = {
    urlPrefix: "",
    // asset holders
    sprites: new AssetBucket(),
    fonts: new AssetBucket(),
    bitmapFonts: new AssetBucket(),
    sounds: new AssetBucket(),
    shaders: new AssetBucket(),
    custom: new AssetBucket(),
    music: {},
    packer: new TexPacker(ggl, SPRITE_ATLAS_WIDTH, SPRITE_ATLAS_HEIGHT),
    // if we finished initially loading all assets
    loaded: false
  };
  return assets2;
};

// src/kassets/bean.png
var bean_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA1CAYAAADyMeOEAAAAAXNSR0IArs4c6QAAAoVJREFUaIHdm7txwkAQhheGAqACiCHzOKQDQrqgILpwSAeEDBnEUAF0gCMxZ7G72qce/mec2Lpf9+3unaS78wgSNZ8uX5729+d1FNWXUuGmXlBOUUEIMckEpeQJgBu6C+BSFngztBR2vd+ovY+7g+p6LbgaWgJrAeUkDYIUXgXdBBwNi6kpABJwMTQH3AZsXRR8GHTfgEth8E3gjdAUcNewpbTgY85sCMCUuOokozE0YM0YRzM9NGAAXd8+omAF5h4lnmBRvpSnZHyLoLEbaN+aKB9KWv/KWw0tAbbANnlG+UvB2dm77NxxdwgBpjrF/d7rW9cbmpvio2A5z8iAYpVU8pGZlo6/2+MSco2lHfd3rv9jAP038e1xef9o2mjvYb2OqpqKE81028/jeietlSEVO5FRWsxWsJit1G3aFpW8iWe5RwpiCZAk25QvV6nz6fIlynRGuTd5WqpJ4guAlDfVKBK87hXljflgv1ON6fV+4+5gVlA17SfeG0heKqQd4l4jI/wrmaA9N9R4ar+wpHJDZyrrfcH0nB66PqAzPi76pn+faSyJk/vzOorYhGurQrzj/P68jtBMawHaHBIR9xoD5O34dy0qQOSYHvqExq2TpT2nf76+w7y251OYF0CRaU+J920TwLUa6inx6OxE6g80lu2ux7Y2eJLF/rCXE6zEPdnenk9o+4ih9AEdnW2q81HXl5LuU6OTl2fXUhqganbXAGq3g6jJOWV/OnoesO6YqqEB/GdNsjf7uHtwj2DzmRNpp7iOZfm6D9oAxB6Yi1gC4oIYeo4MIPdopEQRB+cAko5J1tW386HpB2Kz1eop4Epdwls/kgZ1sh8gZsEjdcWkr//D8Qu3Z3l5Nl1NtAAAAABJRU5ErkJggg==";

// src/assets/sprite.ts
var SpriteData = class _SpriteData {
  tex;
  frames = [new Quad(0, 0, 1, 1)];
  anims = {};
  slice9 = null;
  constructor(tex, frames, anims = {}, slice9 = null) {
    this.tex = tex;
    if (frames) this.frames = frames;
    this.anims = anims;
    this.slice9 = slice9;
  }
  /**
   * @since v3001.0
   */
  get width() {
    return this.tex.width * this.frames[0].w;
  }
  get height() {
    return this.tex.height * this.frames[0].h;
  }
  static from(src, opt = {}) {
    return typeof src === "string" ? _SpriteData.fromURL(src, opt) : Promise.resolve(_SpriteData.fromImage(src, opt));
  }
  static fromImage(data, opt = {}) {
    const [tex, quad2] = assets.packer.add(data);
    const frames = opt.frames ? opt.frames.map(
      (f) => new Quad(
        quad2.x + f.x * quad2.w,
        quad2.y + f.y * quad2.h,
        f.w * quad2.w,
        f.h * quad2.h
      )
    ) : slice(
      opt.sliceX || 1,
      opt.sliceY || 1,
      quad2.x,
      quad2.y,
      quad2.w,
      quad2.h
    );
    return new _SpriteData(tex, frames, opt.anims, opt.slice9);
  }
  static fromURL(url, opt = {}) {
    return loadImg(url).then((img) => _SpriteData.fromImage(img, opt));
  }
};
function resolveSprite(src) {
  if (typeof src === "string") {
    const spr = getSprite(src);
    if (spr) {
      return spr;
    } else if (loadProgress() < 1) {
      return null;
    } else {
      throw new Error(`Sprite not found: ${src}`);
    }
  } else if (src instanceof SpriteData) {
    return Asset.loaded(src);
  } else if (src instanceof Asset) {
    return src;
  } else {
    throw new Error(`Invalid sprite: ${src}`);
  }
}
function getSprite(name) {
  return assets.sprites.get(name) ?? null;
}
function loadSprite(name, src, opt = {
  sliceX: 1,
  sliceY: 1,
  anims: {}
}) {
  src = fixURL(src);
  if (Array.isArray(src)) {
    if (src.some((s) => typeof s === "string")) {
      return assets.sprites.add(
        name,
        Promise.all(src.map((s) => {
          return typeof s === "string" ? loadImg(s) : Promise.resolve(s);
        })).then((images) => createSpriteSheet(images, opt))
      );
    } else {
      return assets.sprites.addLoaded(
        name,
        createSpriteSheet(src, opt)
      );
    }
  } else {
    if (typeof src === "string") {
      return assets.sprites.add(name, SpriteData.from(src, opt));
    } else {
      return assets.sprites.addLoaded(
        name,
        SpriteData.fromImage(src, opt)
      );
    }
  }
}
function slice(x = 1, y = 1, dx = 0, dy = 0, w = 1, h = 1) {
  const frames = [];
  const qw = w / x;
  const qh = h / y;
  for (let j = 0; j < y; j++) {
    for (let i = 0; i < x; i++) {
      frames.push(
        new Quad(
          dx + i * qw,
          dy + j * qh,
          qw,
          qh
        )
      );
    }
  }
  return frames;
}
function createSpriteSheet(images, opt = {}) {
  const canvas2 = document.createElement("canvas");
  const width2 = images[0].width;
  const height2 = images[0].height;
  canvas2.width = width2 * images.length;
  canvas2.height = height2;
  const c2d = canvas2.getContext("2d");
  if (!c2d) throw new Error("Failed to create canvas context");
  images.forEach((img, i) => {
    if (img instanceof ImageData) {
      c2d.putImageData(img, i * width2, 0);
    } else {
      c2d.drawImage(img, i * width2, 0);
    }
  });
  const merged = c2d.getImageData(0, 0, images.length * width2, height2);
  return SpriteData.fromImage(merged, {
    ...opt,
    sliceX: images.length,
    sliceY: 1
  });
}
function loadBean(name = "bean") {
  return loadSprite(name, bean_default);
}

// src/assets/aseprite.ts
function loadAseprite(name, imgSrc, jsonSrc) {
  imgSrc = fixURL(imgSrc);
  jsonSrc = fixURL(jsonSrc);
  if (typeof imgSrc === "string" && !jsonSrc) {
    jsonSrc = getFileName(imgSrc) + ".json";
  }
  const resolveJSON = typeof jsonSrc === "string" ? fetchJSON(jsonSrc) : Promise.resolve(jsonSrc);
  return assets.sprites.add(
    name,
    resolveJSON.then((data) => {
      const size = data.meta.size;
      const frames = data.frames.map((f) => {
        return new Quad(
          f.frame.x / size.w,
          f.frame.y / size.h,
          f.frame.w / size.w,
          f.frame.h / size.h
        );
      });
      const anims = {};
      for (const anim of data.meta.frameTags) {
        if (anim.from === anim.to) {
          anims[anim.name] = anim.from;
        } else {
          anims[anim.name] = {
            from: anim.from,
            to: anim.to,
            speed: 10,
            loop: true,
            pingpong: anim.direction === "pingpong"
          };
        }
      }
      return SpriteData.from(imgSrc, {
        frames,
        anims
      });
    })
  );
}

// src/assets/font.ts
var FontData = class {
  fontface;
  filter = DEF_FONT_FILTER;
  outline = null;
  size = DEF_TEXT_CACHE_SIZE;
  constructor(face, opt = {}) {
    this.fontface = face;
    this.filter = opt.filter ?? DEF_FONT_FILTER;
    this.size = opt.size ?? DEF_TEXT_CACHE_SIZE;
    if (this.size > MAX_TEXT_CACHE_SIZE) {
      throw new Error(`Max font size: ${MAX_TEXT_CACHE_SIZE}`);
    }
    if (opt.outline) {
      this.outline = {
        width: 1,
        color: rgb(0, 0, 0)
      };
      if (typeof opt.outline === "number") {
        this.outline.width = opt.outline;
      } else if (typeof opt.outline === "object") {
        if (opt.outline.width) {
          this.outline.width = opt.outline.width;
        }
        if (opt.outline.color) {
          this.outline.color = opt.outline.color;
        }
      }
    }
  }
};
function resolveFont(src) {
  if (!src) {
    return resolveFont(globalOpt.font ?? DEF_FONT);
  }
  if (typeof src === "string") {
    const bfont = getBitmapFont(src);
    const font = getFont(src);
    if (bfont) {
      return bfont.data ?? bfont;
    } else if (font) {
      return font.data ?? font;
    } else if (document.fonts.check(`${DEF_TEXT_CACHE_SIZE}px ${src}`)) {
      return src;
    } else if (loadProgress() < 1) {
      return null;
    } else {
      throw new Error(`Font not found: ${src}`);
    }
  } else if (src instanceof Asset) {
    return src.data ? src.data : src;
  }
  return src;
}
function getFont(name) {
  return assets.fonts.get(name) ?? null;
}
function loadFont(name, src, opt = {}) {
  const fontSrc = fixURL(src);
  const font = new FontFace(
    name,
    typeof src === "string" ? `url(${fontSrc})` : fontSrc
  );
  document.fonts.add(font);
  return assets.fonts.add(
    name,
    font.load().catch((err) => {
      throw new Error(`Failed to load font from "${fontSrc}": ${err}`);
    }).then((face) => new FontData(face, opt))
  );
}
function makeFont(tex, gw, gh, chars) {
  const cols = tex.width / gw;
  const map2 = {};
  const charMap = chars.split("").entries();
  for (const [i, ch] of charMap) {
    map2[ch] = new Quad(
      i % cols * gw,
      Math.floor(i / cols) * gh,
      gw,
      gh
    );
  }
  return {
    tex,
    map: map2,
    size: gh
  };
}

// src/assets/bitmapFont.ts
function getBitmapFont(name) {
  return assets.bitmapFonts.get(name) ?? null;
}
function loadBitmapFont(name, src, gw, gh, opt = {}) {
  const fontSrc = fixURL(src);
  return assets.bitmapFonts.add(
    name,
    loadImg(fontSrc).then((img) => {
      return makeFont(
        Texture.fromImage(gfx.ggl, img, opt),
        gw,
        gh,
        opt.chars ?? ASCII_CHARS
      );
    })
  );
}

// src/assets/pedit.ts
function loadPedit(name, src) {
  src = fixURL(src);
  return assets.sprites.add(
    name,
    new Promise(async (resolve) => {
      const data = typeof src === "string" ? await fetchJSON(src) : src;
      const images = await Promise.all(data.frames.map(loadImg));
      const canvas2 = document.createElement("canvas");
      canvas2.width = data.width;
      canvas2.height = data.height * data.frames.length;
      const c2d = canvas2.getContext("2d");
      if (!c2d) throw new Error("Failed to create canvas context");
      images.forEach((img, i) => {
        c2d.drawImage(img, 0, i * data.height);
      });
      const spr = await loadSprite(null, canvas2, {
        sliceY: data.frames.length,
        anims: data.anims
      });
      resolve(spr);
    })
  );
}

// src/assets/shader.ts
var Shader = class {
  ctx;
  glProgram;
  constructor(ctx, vert, frag, attribs) {
    this.ctx = ctx;
    ctx.onDestroy(() => this.free());
    const gl = ctx.gl;
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertShader || !fragShader) {
      throw new Error("Failed to create shader");
    }
    gl.shaderSource(vertShader, vert);
    gl.shaderSource(fragShader, frag);
    gl.compileShader(vertShader);
    gl.compileShader(fragShader);
    const prog = gl.createProgram();
    this.glProgram = prog;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    attribs.forEach((attrib, i) => gl.bindAttribLocation(prog, i, attrib));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const vertError = gl.getShaderInfoLog(vertShader);
      if (vertError) throw new Error("VERTEX SHADER " + vertError);
      const fragError = gl.getShaderInfoLog(fragShader);
      if (fragError) throw new Error("FRAGMENT SHADER " + fragError);
    }
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
  }
  bind() {
    this.ctx.pushProgram(this.glProgram);
  }
  unbind() {
    this.ctx.popProgram();
  }
  send(uniform) {
    const gl = this.ctx.gl;
    for (const name in uniform) {
      const val = uniform[name];
      const loc = gl.getUniformLocation(this.glProgram, name);
      if (typeof val === "number") {
        gl.uniform1f(loc, val);
      } else if (val instanceof Mat4) {
        gl.uniformMatrix4fv(loc, false, new Float32Array(val.m));
      } else if (val instanceof Color) {
        gl.uniform3f(loc, val.r, val.g, val.b);
      } else if (val instanceof Vec2) {
        gl.uniform2f(loc, val.x, val.y);
      } else if (Array.isArray(val)) {
        const first = val[0];
        if (arrayIsNumber(val)) {
          gl.uniform1fv(loc, val);
        } else if (arrayIsVec2(val)) {
          gl.uniform2fv(loc, val.map((v) => [v.x, v.y]).flat());
        } else if (arrayIsColor(val)) {
          gl.uniform3fv(loc, val.map((v) => [v.r, v.g, v.b]).flat());
        }
      } else {
        throw new Error("Unsupported uniform data type");
      }
    }
  }
  free() {
    this.ctx.gl.deleteProgram(this.glProgram);
  }
};
function makeShader(ggl, vertSrc = DEF_VERT, fragSrc = DEF_FRAG) {
  const vcode = VERT_TEMPLATE.replace("{{user}}", vertSrc ?? DEF_VERT);
  const fcode = FRAG_TEMPLATE.replace("{{user}}", fragSrc ?? DEF_FRAG);
  try {
    return new Shader(
      ggl,
      vcode,
      fcode,
      VERTEX_FORMAT.map((vert) => vert.name)
    );
  } catch (e) {
    const lineOffset = 14;
    const fmt = /(?<type>^\w+) SHADER ERROR: 0:(?<line>\d+): (?<msg>.+)/;
    const match = getErrorMessage(e).match(fmt);
    if (!match?.groups) throw e;
    const line = Number(match.groups.line) - lineOffset;
    const msg = match.groups.msg.trim();
    const ty = match.groups.type.toLowerCase();
    throw new Error(`${ty} shader line ${line}: ${msg}`);
  }
}
function resolveShader(src) {
  if (!src) {
    return gfx.defShader;
  }
  if (typeof src === "string") {
    const shader2 = getShader(src);
    if (shader2) {
      return shader2.data ?? shader2;
    } else if (loadProgress() < 1) {
      return null;
    } else {
      throw new Error(`Shader not found: ${src}`);
    }
  } else if (src instanceof Asset) {
    return src.data ? src.data : src;
  }
  return src;
}
function getShader(name) {
  return assets.shaders.get(name) ?? null;
}
function loadShader(name, vert, frag) {
  return assets.shaders.addLoaded(name, makeShader(gfx.ggl, vert, frag));
}
function loadShaderURL(name, vert, frag) {
  vert = fixURL(vert);
  frag = fixURL(frag);
  const resolveUrl = (url) => url ? fetchText(url) : Promise.resolve(null);
  const load2 = Promise.all([resolveUrl(vert), resolveUrl(frag)]).then(([vcode, fcode]) => {
    return makeShader(gfx.ggl, vcode, fcode);
  });
  return assets.shaders.add(name, load2);
}

// src/assets/sound.ts
var SoundData = class _SoundData {
  buf;
  constructor(buf) {
    this.buf = buf;
  }
  static fromArrayBuffer(buf) {
    return new Promise(
      (resolve, reject) => audio.ctx.decodeAudioData(buf, resolve, reject)
    ).then((buf2) => new _SoundData(buf2));
  }
  static fromURL(url) {
    if (isDataURL(url)) {
      return _SoundData.fromArrayBuffer(dataURLToArrayBuffer(url));
    } else {
      return fetchArrayBuffer(url).then(
        (buf) => _SoundData.fromArrayBuffer(buf)
      );
    }
  }
};
function resolveSound(src) {
  if (typeof src === "string") {
    const snd = getSound(src);
    if (snd) {
      return snd;
    } else if (loadProgress() < 1) {
      return null;
    } else {
      throw new Error(`Sound not found: ${src}`);
    }
  } else if (src instanceof SoundData) {
    return Asset.loaded(src);
  } else if (src instanceof Asset) {
    return src;
  } else {
    throw new Error(`Invalid sound: ${src}`);
  }
}
function getSound(name) {
  return assets.sounds.get(name) ?? null;
}
function loadSound(name, src) {
  src = fixURL(src);
  return assets.sounds.add(
    name,
    typeof src === "string" ? SoundData.fromURL(src) : SoundData.fromArrayBuffer(src)
  );
}
function loadMusic(name, url) {
  const musicUrl = fixURL(url);
  const a = new Audio(musicUrl);
  a.preload = "auto";
  return assets.music[name] = musicUrl;
}

// src/assets/spriteAtlas.ts
function loadSpriteAtlas(src, data) {
  src = fixURL(src);
  if (typeof data === "string") {
    return load(
      new Promise((res, rej) => {
        fetchJSON(data).then((json) => {
          loadSpriteAtlas(src, json).then(res).catch(rej);
        });
      })
    );
  }
  return load(
    SpriteData.from(src).then((atlas) => {
      const map2 = {};
      for (const name in data) {
        const info = data[name];
        const quad2 = atlas.frames[0];
        const w = SPRITE_ATLAS_WIDTH * quad2.w;
        const h = SPRITE_ATLAS_HEIGHT * quad2.h;
        const frames = info.frames ? info.frames.map(
          (f) => new Quad(
            quad2.x + (info.x + f.x) / w * quad2.w,
            quad2.y + (info.y + f.y) / h * quad2.h,
            f.w / w * quad2.w,
            f.h / h * quad2.h
          )
        ) : slice(
          info.sliceX || 1,
          info.sliceY || 1,
          quad2.x + info.x / w * quad2.w,
          quad2.y + info.y / h * quad2.h,
          info.width / w * quad2.w,
          info.height / h * quad2.h
        );
        const spr = new SpriteData(atlas.tex, frames, info.anims);
        assets.sprites.addLoaded(name, spr);
        map2[name] = spr;
      }
      return map2;
    })
  );
}

// src/gfx/draw/drawRaw.ts
function drawRaw(verts, indices, fixed2 = false, tex, shaderSrc, uniform = {}) {
  const parsedTex = tex ?? gfx.defTex;
  const parsedShader = shaderSrc ?? gfx.defShader;
  const shader2 = resolveShader(parsedShader);
  if (!shader2 || shader2 instanceof Asset) {
    return;
  }
  const transform = gfx.fixed || fixed2 ? gfx.transform : game.cam.transform.mult(gfx.transform);
  const vv = [];
  for (const v of verts) {
    const pt = screen2ndc(transform.multVec2(v.pos));
    vv.push(
      pt.x,
      pt.y,
      v.uv.x,
      v.uv.y,
      v.color.r / 255,
      v.color.g / 255,
      v.color.b / 255,
      v.opacity
    );
  }
  gfx.renderer.push(
    gfx.ggl.gl.TRIANGLES,
    vv,
    indices,
    shader2,
    parsedTex,
    uniform
  );
}

// src/gfx/draw/drawPolygon.ts
function drawPolygon(opt) {
  if (!opt.pts) {
    throw new Error('drawPolygon() requires property "pts".');
  }
  const npts = opt.pts.length;
  if (npts < 3) {
    return;
  }
  pushTransform();
  pushTranslate(opt.pos);
  pushScale(opt.scale);
  pushRotate(opt.angle);
  pushTranslate(opt.offset);
  if (opt.fill !== false) {
    const color2 = opt.color ?? Color.WHITE;
    const verts = opt.pts.map((pt, i) => ({
      pos: new Vec2(pt.x, pt.y),
      uv: opt.uv ? opt.uv[i] : new Vec2(0, 0),
      color: opt.colors ? opt.colors[i] ? opt.colors[i].mult(color2) : color2 : color2,
      opacity: opt.opacity ?? 1
    }));
    let indices;
    if (opt.triangulate) {
      const triangles = triangulate(opt.pts);
      indices = triangles.map((t) => t.map((p) => opt.pts.indexOf(p))).flat();
    } else {
      indices = [...Array(npts - 2).keys()].map((n) => [0, n + 1, n + 2]).flat();
    }
    drawRaw(
      verts,
      opt.indices ?? indices,
      opt.fixed,
      opt.uv ? opt.tex : gfx.defTex,
      opt.shader,
      opt.uniform ?? void 0
    );
  }
  if (opt.outline) {
    drawLines({
      pts: [...opt.pts, opt.pts[0]],
      radius: opt.radius,
      width: opt.outline.width,
      color: opt.outline.color,
      join: opt.outline.join,
      uniform: opt.uniform,
      fixed: opt.fixed,
      opacity: opt.opacity ?? opt.outline.opacity
    });
  }
  popTransform();
}

// src/gfx/draw/drawEllipse.ts
function drawEllipse(opt) {
  if (opt.radiusX === void 0 || opt.radiusY === void 0) {
    throw new Error(
      'drawEllipse() requires properties "radiusX" and "radiusY".'
    );
  }
  if (opt.radiusX === 0 || opt.radiusY === 0) {
    return;
  }
  const start = opt.start ?? 0;
  const end = opt.end ?? 360;
  const offset = anchorPt(opt.anchor ?? "center").scale(
    new Vec2(-opt.radiusX, -opt.radiusY)
  );
  const pts = getArcPts(
    offset,
    opt.radiusX,
    opt.radiusY,
    start,
    end,
    opt.resolution
  );
  pts.unshift(offset);
  const polyOpt = Object.assign({}, opt, {
    pts,
    radius: 0,
    ...opt.gradient ? {
      colors: [
        opt.gradient[0],
        ...Array(pts.length - 1).fill(opt.gradient[1])
      ]
    } : {}
  });
  if (end - start >= 360 && opt.outline) {
    if (opt.fill !== false) {
      drawPolygon(Object.assign({}, polyOpt, {
        outline: null
      }));
    }
    drawPolygon(Object.assign({}, polyOpt, {
      pts: pts.slice(1),
      fill: false
    }));
    return;
  }
  drawPolygon(polyOpt);
}

// src/gfx/draw/drawCircle.ts
function drawCircle(opt) {
  if (typeof opt.radius !== "number") {
    throw new Error('drawCircle() requires property "radius".');
  }
  if (opt.radius === 0) {
    return;
  }
  drawEllipse(Object.assign({}, opt, {
    radiusX: opt.radius,
    radiusY: opt.radius,
    angle: 0
  }));
}

// src/gfx/draw/drawLine.ts
function drawLine(opt) {
  const { p1, p2 } = opt;
  if (!p1 || !p2) {
    throw new Error(
      'drawLine() requires properties "p1" and "p2".'
    );
  }
  const w = opt.width || 1;
  const dis = p2.sub(p1).unit().normal().scale(w * 0.5);
  const verts = [
    p1.sub(dis),
    p1.add(dis),
    p2.add(dis),
    p2.sub(dis)
  ].map((p) => ({
    pos: new Vec2(p.x, p.y),
    uv: new Vec2(0),
    color: opt.color ?? Color.WHITE,
    opacity: opt.opacity ?? 1
  }));
  drawRaw(
    verts,
    [0, 1, 3, 1, 2, 3],
    opt.fixed,
    gfx.defTex,
    opt.shader,
    opt.uniform ?? void 0
  );
}
function _drawLinesBevel(opt) {
  const pts = opt.pts;
  const vertices = [];
  const halfWidth = (opt.width || 1) * 0.5;
  const isLoop = pts[0] === pts[pts.length - 1] || pts[0].eq(pts[pts.length - 1]);
  const offset = opt.pos || vec2(0, 0);
  let segment;
  if (isLoop) {
    segment = pts[0].sub(pts[pts.length - 2]);
  } else {
    segment = pts[1].sub(pts[0]);
  }
  let length = segment.len();
  let normal = segment.normal().scale(-halfWidth / length);
  let pt1;
  let pt2 = pts[0];
  if (!isLoop) {
    switch (opt.cap) {
      case "square": {
        const dir = segment.scale(-halfWidth / length);
        vertices.push(pt2.add(dir).add(normal));
        vertices.push(pt2.add(dir).sub(normal));
        break;
      }
      case "round": {
        const n = Math.max(halfWidth, 10);
        const angle = Math.PI / n;
        let vector = normal.scale(-1);
        const cs = Math.cos(angle);
        const sn = Math.sin(angle);
        for (let j = 0; j < n; j++) {
          vertices.push(pt2);
          vertices.push(pt2.sub(vector));
          vector = vec2(
            vector.x * cs - vector.y * sn,
            vector.x * sn + vector.y * cs
          );
        }
      }
    }
  }
  for (let i = 1; i < pts.length; i++) {
    if (pt2 === pts[i] || pt2.eq(pts[i])) continue;
    pt1 = pt2;
    pt2 = pts[i];
    const nextSegment = pt2.sub(pt1);
    const nextLength = nextSegment.len();
    const nextNormal = nextSegment.normal().scale(
      -halfWidth / nextLength
    );
    const det = segment.cross(nextSegment);
    if (Math.abs(det) / (length * nextLength) < 0.05) {
      vertices.push(pt1.add(normal));
      vertices.push(pt1.sub(normal));
      if (segment.dot(nextSegment) < 0) {
        vertices.push(pt1.sub(normal));
        vertices.push(pt1.add(normal));
      }
      segment = nextSegment;
      length = nextLength;
      normal = nextNormal;
      continue;
    }
    const lambda = nextNormal.sub(normal).cross(nextSegment) / det;
    const d = normal.add(segment.scale(lambda));
    if (det > 0) {
      vertices.push(pt1.add(d));
      vertices.push(pt1.sub(normal));
      vertices.push(pt1.add(d));
      vertices.push(pt1.sub(nextNormal));
    } else {
      vertices.push(pt1.add(normal));
      vertices.push(pt1.sub(d));
      vertices.push(pt1.add(nextNormal));
      vertices.push(pt1.sub(d));
    }
    segment = nextSegment;
    length = nextLength;
    normal = nextNormal;
  }
  if (!isLoop) {
    vertices.push(pt2.add(normal));
    vertices.push(pt2.sub(normal));
    switch (opt.cap) {
      case "square": {
        const dir = segment.scale(halfWidth / length);
        vertices.push(pt2.add(dir).add(normal));
        vertices.push(pt2.add(dir).sub(normal));
        break;
      }
      case "round": {
        const n = Math.max(halfWidth, 10);
        const angle = Math.PI / n;
        let vector = normal.scale(1);
        const cs = Math.cos(angle);
        const sn = Math.sin(angle);
        for (let j = 0; j < n; j++) {
          vector = vec2(
            vector.x * cs - vector.y * sn,
            vector.x * sn + vector.y * cs
          );
          vertices.push(pt2);
          vertices.push(pt2.sub(vector));
        }
      }
    }
  }
  if (vertices.length < 4) return;
  const verts = vertices.map((v) => ({
    pos: offset.add(v),
    uv: vec2(),
    color: opt.color || Color.WHITE,
    opacity: opt.opacity ?? 1
  }));
  const indices = [];
  let index = 0;
  for (let i = 0; i < vertices.length - 2; i += 2) {
    indices[index++] = i + 1;
    indices[index++] = i;
    indices[index++] = i + 2;
    indices[index++] = i + 2;
    indices[index++] = i + 3;
    indices[index++] = i + 1;
  }
  if (isLoop) {
    indices[index++] = vertices.length - 1;
    indices[index++] = vertices.length - 2;
    indices[index++] = 0;
    indices[index++] = 0;
    indices[index++] = 1;
    indices[index++] = vertices.length - 1;
  }
  drawRaw(
    verts,
    indices,
    opt.fixed,
    gfx.defTex,
    opt.shader,
    opt.uniform ?? void 0
  );
}
function _drawLinesRound(opt) {
  const pts = opt.pts;
  const vertices = [];
  const halfWidth = (opt.width || 1) * 0.5;
  const isLoop = pts[0] === pts[pts.length - 1] || pts[0].eq(pts[pts.length - 1]);
  const offset = opt.pos || vec2(0, 0);
  let segment;
  if (isLoop) {
    segment = pts[0].sub(pts[pts.length - 2]);
  } else {
    segment = pts[1].sub(pts[0]);
  }
  let length = segment.len();
  let normal = segment.normal().scale(-halfWidth / length);
  let pt1;
  let pt2 = pts[0];
  if (!isLoop) {
    switch (opt.cap) {
      case "square": {
        const dir = segment.scale(-halfWidth / length);
        vertices.push(pt2.add(dir).add(normal));
        vertices.push(pt2.add(dir).sub(normal));
        break;
      }
      case "round": {
        const n = Math.max(halfWidth, 10);
        const angle = Math.PI / n;
        let vector = normal.scale(-1);
        const cs = Math.cos(angle);
        const sn = Math.sin(angle);
        for (let j = 0; j < n; j++) {
          vertices.push(pt2);
          vertices.push(pt2.sub(vector));
          vector = vec2(
            vector.x * cs - vector.y * sn,
            vector.x * sn + vector.y * cs
          );
        }
      }
    }
  }
  for (let i = 1; i < pts.length; i++) {
    if (pt2 === pts[i] || pt2.eq(pts[i])) continue;
    pt1 = pt2;
    pt2 = pts[i];
    const nextSegment = pt2.sub(pt1);
    const nextLength = nextSegment.len();
    const nextNormal = nextSegment.normal().scale(
      -halfWidth / nextLength
    );
    const det = segment.cross(nextSegment);
    if (Math.abs(det) / (length * nextLength) < 0.05) {
      vertices.push(pt1.add(normal));
      vertices.push(pt1.sub(normal));
      if (segment.dot(nextSegment) < 0) {
        vertices.push(pt1.sub(normal));
        vertices.push(pt1.add(normal));
      }
      segment = nextSegment;
      length = nextLength;
      normal = nextNormal;
      continue;
    }
    const lambda = nextNormal.sub(normal).cross(nextSegment) / det;
    const d = normal.add(segment.scale(lambda));
    if (det > 0) {
      const fixedPoint = pt1.add(d);
      const n = Math.max(halfWidth, 10);
      const angle = deg2rad(normal.angleBetween(nextNormal) / n);
      let vector = normal;
      const cs = Math.cos(angle);
      const sn = Math.sin(angle);
      for (let j = 0; j < n; j++) {
        vertices.push(fixedPoint);
        vertices.push(pt1.sub(vector));
        vector = vec2(
          vector.x * cs - vector.y * sn,
          vector.x * sn + vector.y * cs
        );
      }
    } else {
      const fixedPoint = pt1.sub(d);
      const n = Math.max(halfWidth, 10);
      const angle = deg2rad(normal.angleBetween(nextNormal) / n);
      let vector = normal;
      const cs = Math.cos(angle);
      const sn = Math.sin(angle);
      for (let j = 0; j < n; j++) {
        vertices.push(pt1.add(vector));
        vertices.push(fixedPoint);
        vector = vec2(
          vector.x * cs - vector.y * sn,
          vector.x * sn + vector.y * cs
        );
      }
    }
    segment = nextSegment;
    length = nextLength;
    normal = nextNormal;
  }
  if (!isLoop) {
    vertices.push(pt2.add(normal));
    vertices.push(pt2.sub(normal));
    switch (opt.cap) {
      case "square": {
        const dir = segment.scale(halfWidth / length);
        vertices.push(pt2.add(dir).add(normal));
        vertices.push(pt2.add(dir).sub(normal));
        break;
      }
      case "round": {
        const n = Math.max(halfWidth, 10);
        const angle = Math.PI / n;
        let vector = normal.scale(1);
        const cs = Math.cos(angle);
        const sn = Math.sin(angle);
        for (let j = 0; j < n; j++) {
          vector = vec2(
            vector.x * cs - vector.y * sn,
            vector.x * sn + vector.y * cs
          );
          vertices.push(pt2);
          vertices.push(pt2.sub(vector));
        }
      }
    }
  }
  if (vertices.length < 4) return;
  const verts = vertices.map((v) => ({
    pos: offset.add(v),
    uv: vec2(),
    color: opt.color || Color.WHITE,
    opacity: opt.opacity ?? 1
  }));
  const indices = [];
  let index = 0;
  for (let i = 0; i < vertices.length - 2; i += 2) {
    indices[index++] = i + 1;
    indices[index++] = i;
    indices[index++] = i + 2;
    indices[index++] = i + 2;
    indices[index++] = i + 3;
    indices[index++] = i + 1;
  }
  if (isLoop) {
    indices[index++] = vertices.length - 1;
    indices[index++] = vertices.length - 2;
    indices[index++] = 0;
    indices[index++] = 0;
    indices[index++] = 1;
    indices[index++] = vertices.length - 1;
  }
  drawRaw(
    verts,
    indices,
    opt.fixed,
    gfx.defTex,
    opt.shader,
    opt.uniform ?? void 0
  );
}
function _drawLinesMiter(opt) {
  const pts = opt.pts;
  const vertices = [];
  const halfWidth = (opt.width || 1) * 0.5;
  const isLoop = pts[0] === pts[pts.length - 1] || pts[0].eq(pts[pts.length - 1]);
  const offset = opt.pos || vec2(0, 0);
  let segment;
  if (isLoop) {
    segment = pts[0].sub(pts[pts.length - 2]);
  } else {
    segment = pts[1].sub(pts[0]);
  }
  let length = segment.len();
  let normal = segment.normal().scale(-halfWidth / length);
  let pt1;
  let pt2 = pts[0];
  if (!isLoop) {
    switch (opt.cap) {
      case "square": {
        const dir = segment.scale(-halfWidth / length);
        vertices.push(pt2.add(dir).add(normal));
        vertices.push(pt2.add(dir).sub(normal));
        break;
      }
      case "round": {
        const n = Math.max(halfWidth, 10);
        const angle = Math.PI / n;
        let vector = normal.scale(-1);
        const cs = Math.cos(angle);
        const sn = Math.sin(angle);
        for (let j = 0; j < n; j++) {
          vertices.push(pt2);
          vertices.push(pt2.sub(vector));
          vector = vec2(
            vector.x * cs - vector.y * sn,
            vector.x * sn + vector.y * cs
          );
        }
      }
    }
  }
  for (let i = 1; i < pts.length; i++) {
    if (pt2 === pts[i] || pt2.eq(pts[i])) continue;
    pt1 = pt2;
    pt2 = pts[i];
    const nextSegment = pt2.sub(pt1);
    const nextLength = nextSegment.len();
    const nextNormal = nextSegment.normal().scale(
      -halfWidth / nextLength
    );
    const det = segment.cross(nextSegment);
    if (Math.abs(det) / (length * nextLength) < 0.05) {
      vertices.push(pt1.add(normal));
      vertices.push(pt1.sub(normal));
      if (segment.dot(nextSegment) < 0) {
        vertices.push(pt1.sub(normal));
        vertices.push(pt1.add(normal));
      }
      segment = nextSegment;
      length = nextLength;
      normal = nextNormal;
      continue;
    }
    const lambda = nextNormal.sub(normal).cross(nextSegment) / det;
    const d = normal.add(segment.scale(lambda));
    vertices.push(pt1.add(d));
    vertices.push(pt1.sub(d));
    segment = nextSegment;
    length = nextLength;
    normal = nextNormal;
  }
  if (!isLoop) {
    vertices.push(pt2.add(normal));
    vertices.push(pt2.sub(normal));
    switch (opt.cap) {
      case "square": {
        const dir = segment.scale(halfWidth / length);
        vertices.push(pt2.add(dir).add(normal));
        vertices.push(pt2.add(dir).sub(normal));
        break;
      }
      case "round": {
        const n = Math.max(halfWidth, 10);
        const angle = Math.PI / n;
        let vector = normal.scale(1);
        const cs = Math.cos(angle);
        const sn = Math.sin(angle);
        for (let j = 0; j < n; j++) {
          vector = vec2(
            vector.x * cs - vector.y * sn,
            vector.x * sn + vector.y * cs
          );
          vertices.push(pt2);
          vertices.push(pt2.sub(vector));
        }
      }
    }
  }
  if (vertices.length < 4) return;
  const verts = vertices.map((v) => ({
    pos: offset.add(v),
    uv: vec2(),
    color: opt.color || Color.WHITE,
    opacity: opt.opacity ?? 1
  }));
  const indices = [];
  let index = 0;
  for (let i = 0; i < vertices.length - 2; i += 2) {
    indices[index++] = i + 1;
    indices[index++] = i;
    indices[index++] = i + 2;
    indices[index++] = i + 2;
    indices[index++] = i + 3;
    indices[index++] = i + 1;
  }
  if (isLoop) {
    indices[index++] = vertices.length - 1;
    indices[index++] = vertices.length - 2;
    indices[index++] = 0;
    indices[index++] = 0;
    indices[index++] = 1;
    indices[index++] = vertices.length - 1;
  }
  drawRaw(
    verts,
    indices,
    opt.fixed,
    gfx.defTex,
    opt.shader,
    opt.uniform ?? void 0
  );
}
function drawLines(opt) {
  const pts = opt.pts;
  const width2 = opt.width ?? 1;
  if (!pts) {
    throw new Error('drawLines() requires property "pts".');
  }
  if (pts.length < 2) {
    return;
  }
  if (pts.length > 2) {
    switch (opt.join) {
      case "bevel":
        return _drawLinesBevel(opt);
      case "round":
        return _drawLinesRound(opt);
      case "miter":
        return _drawLinesMiter(opt);
    }
  }
  if (opt.radius && pts.length >= 3) {
    drawLine(Object.assign({}, opt, { p1: pts[0], p2: pts[1] }));
    for (let i = 1; i < pts.length - 2; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      drawLine(Object.assign({}, opt, {
        p1,
        p2
      }));
    }
    drawLine(Object.assign({}, opt, {
      p1: pts[pts.length - 2],
      p2: pts[pts.length - 1]
    }));
  } else {
    for (let i = 0; i < pts.length - 1; i++) {
      drawLine(Object.assign({}, opt, {
        p1: pts[i],
        p2: pts[i + 1]
      }));
      if (opt.join !== "none") {
        drawCircle(Object.assign({}, opt, {
          pos: pts[i],
          radius: width2 / 2
        }));
      }
    }
  }
}

// src/gfx/draw/drawCurve.ts
function drawCurve(curve, opt) {
  const segments = opt.segments ?? 16;
  const p = [];
  for (let i = 0; i <= segments; i++) {
    p.push(curve(i / segments));
  }
  drawLines({
    pts: p,
    width: opt.width || 1,
    pos: opt.pos,
    color: opt.color,
    opacity: opt.opacity
  });
}

// src/gfx/draw/drawBezier.ts
function drawBezier(opt) {
  drawCurve(
    (t) => evaluateBezier(opt.pt1, opt.pt2, opt.pt3, opt.pt4, t),
    opt
  );
}

// src/gfx/gfx.ts
var Texture = class _Texture {
  ctx;
  src = null;
  glTex;
  width;
  height;
  constructor(ctx, w, h, opt = {}) {
    this.ctx = ctx;
    const gl = ctx.gl;
    const glText = ctx.gl.createTexture();
    if (!glText) {
      throw new Error("Failed to create texture");
    }
    this.glTex = glText;
    ctx.onDestroy(() => this.free());
    this.width = w;
    this.height = h;
    const filter = {
      "linear": gl.LINEAR,
      "nearest": gl.NEAREST
    }[opt.filter ?? ctx.opts.texFilter ?? "nearest"];
    const wrap = {
      "repeat": gl.REPEAT,
      "clampToEdge": gl.CLAMP_TO_EDGE
    }[opt.wrap ?? "clampToEdge"];
    this.bind();
    if (w && h) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        w,
        h,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    this.unbind();
  }
  static fromImage(ctx, img, opt = {}) {
    const tex = new _Texture(ctx, img.width, img.height, opt);
    tex.update(img);
    tex.src = img;
    return tex;
  }
  update(img, x = 0, y = 0) {
    const gl = this.ctx.gl;
    this.bind();
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      x,
      y,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      img
    );
    this.unbind();
  }
  bind() {
    this.ctx.pushTexture2D(this.glTex);
  }
  unbind() {
    this.ctx.popTexture2D();
  }
  /** Frees up texture memory. Call this once the texture is no longer being used to avoid memory leaks. */
  free() {
    this.ctx.gl.deleteTexture(this.glTex);
  }
};
var FrameBuffer = class {
  ctx;
  tex;
  glFramebuffer;
  glRenderbuffer;
  constructor(ctx, w, h, opt = {}) {
    this.ctx = ctx;
    const gl = ctx.gl;
    ctx.onDestroy(() => this.free());
    this.tex = new Texture(ctx, w, h, opt);
    const frameBuffer = gl.createFramebuffer();
    const renderBuffer = gl.createRenderbuffer();
    if (!frameBuffer || !renderBuffer) {
      throw new Error("Failed to create framebuffer");
    }
    this.glFramebuffer = frameBuffer;
    this.glRenderbuffer = renderBuffer;
    this.bind();
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, w, h);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.tex.glTex,
      0
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_STENCIL_ATTACHMENT,
      gl.RENDERBUFFER,
      this.glRenderbuffer
    );
    this.unbind();
  }
  get width() {
    return this.tex.width;
  }
  get height() {
    return this.tex.height;
  }
  toImageData() {
    const gl = this.ctx.gl;
    const data = new Uint8ClampedArray(this.width * this.height * 4);
    this.bind();
    gl.readPixels(
      0,
      0,
      this.width,
      this.height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data
    );
    this.unbind();
    const bytesPerRow = this.width * 4;
    const temp = new Uint8Array(bytesPerRow);
    for (let y = 0; y < (this.height / 2 | 0); y++) {
      const topOffset = y * bytesPerRow;
      const bottomOffset = (this.height - y - 1) * bytesPerRow;
      temp.set(data.subarray(topOffset, topOffset + bytesPerRow));
      data.copyWithin(
        topOffset,
        bottomOffset,
        bottomOffset + bytesPerRow
      );
      data.set(temp, bottomOffset);
    }
    return new ImageData(data, this.width, this.height);
  }
  toDataURL() {
    const canvas2 = document.createElement("canvas");
    const ctx = canvas2.getContext("2d");
    canvas2.width = this.width;
    canvas2.height = this.height;
    if (!ctx) throw new Error("Failed to get 2d context");
    ctx.putImageData(this.toImageData(), 0, 0);
    return canvas2.toDataURL();
  }
  clear() {
    const gl = this.ctx.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  draw(action) {
    this.bind();
    action();
    this.unbind();
  }
  bind() {
    this.ctx.pushFramebuffer(this.glFramebuffer);
    this.ctx.pushRenderbuffer(this.glRenderbuffer);
    this.ctx.pushViewport({ x: 0, y: 0, w: this.width, h: this.height });
  }
  unbind() {
    this.ctx.popFramebuffer();
    this.ctx.popRenderbuffer();
    this.ctx.popViewport();
  }
  free() {
    const gl = this.ctx.gl;
    gl.deleteFramebuffer(this.glFramebuffer);
    gl.deleteRenderbuffer(this.glRenderbuffer);
    this.tex.free();
  }
};
var BatchRenderer = class {
  ctx;
  glVBuf;
  glIBuf;
  vqueue = [];
  iqueue = [];
  stride;
  maxVertices;
  maxIndices;
  vertexFormat;
  numDraws = 0;
  curPrimitive = null;
  curTex = null;
  curShader = null;
  curUniform = {};
  constructor(ctx, format, maxVertices, maxIndices) {
    const gl = ctx.gl;
    this.vertexFormat = format;
    this.ctx = ctx;
    this.stride = format.reduce((sum, f) => sum + f.size, 0);
    this.maxVertices = maxVertices;
    this.maxIndices = maxIndices;
    const glVBuf = gl.createBuffer();
    if (!glVBuf) {
      throw new Error("Failed to create vertex buffer");
    }
    this.glVBuf = glVBuf;
    ctx.pushArrayBuffer(this.glVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, maxVertices * 4, gl.DYNAMIC_DRAW);
    ctx.popArrayBuffer();
    this.glIBuf = gl.createBuffer();
    ctx.pushElementArrayBuffer(this.glIBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, maxIndices * 4, gl.DYNAMIC_DRAW);
    ctx.popElementArrayBuffer();
  }
  push(primitive, verts, indices, shader2, tex = null, uniform = {}) {
    if (primitive !== this.curPrimitive || tex !== this.curTex || shader2 !== this.curShader || !deepEq(this.curUniform, uniform) || this.vqueue.length + verts.length * this.stride > this.maxVertices || this.iqueue.length + indices.length > this.maxIndices) {
      this.flush();
    }
    const indexOffset = this.vqueue.length / this.stride;
    for (const v of verts) {
      this.vqueue.push(v);
    }
    for (const i of indices) {
      this.iqueue.push(i + indexOffset);
    }
    this.curPrimitive = primitive;
    this.curShader = shader2;
    this.curTex = tex;
    this.curUniform = uniform;
  }
  flush() {
    if (!this.curPrimitive || !this.curShader || this.vqueue.length === 0 || this.iqueue.length === 0) {
      return;
    }
    const gl = this.ctx.gl;
    this.ctx.pushArrayBuffer(this.glVBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.vqueue));
    this.ctx.pushElementArrayBuffer(this.glIBuf);
    gl.bufferSubData(
      gl.ELEMENT_ARRAY_BUFFER,
      0,
      new Uint16Array(this.iqueue)
    );
    this.ctx.setVertexFormat(this.vertexFormat);
    this.curShader.bind();
    this.curShader.send(this.curUniform);
    this.curTex?.bind();
    gl.drawElements(
      this.curPrimitive,
      this.iqueue.length,
      gl.UNSIGNED_SHORT,
      0
    );
    this.curTex?.unbind();
    this.curShader.unbind();
    this.ctx.popArrayBuffer();
    this.ctx.popElementArrayBuffer();
    this.vqueue = [];
    this.iqueue = [];
    this.numDraws++;
  }
  free() {
    const gl = this.ctx.gl;
    gl.deleteBuffer(this.glVBuf);
    gl.deleteBuffer(this.glIBuf);
  }
};
function genStack(setFunc) {
  const stack = [];
  const push = (item) => {
    stack.push(item);
    setFunc(item);
  };
  const pop = () => {
    stack.pop();
    setFunc(cur() ?? null);
  };
  const cur = () => stack[stack.length - 1];
  return [push, pop, cur];
}
function initGfx(gl, opts = {}) {
  const gc = [];
  function onDestroy2(action) {
    gc.push(action);
  }
  function destroy2() {
    gc.forEach((action) => action());
    const extension = gl.getExtension("WEBGL_lose_context");
    if (extension) extension.loseContext();
  }
  let curVertexFormat = null;
  function setVertexFormat(fmt) {
    if (deepEq(fmt, curVertexFormat)) return;
    curVertexFormat = fmt;
    const stride = fmt.reduce((sum, f) => sum + f.size, 0);
    fmt.reduce((offset, f, i) => {
      gl.vertexAttribPointer(
        i,
        f.size,
        gl.FLOAT,
        false,
        stride * 4,
        offset
      );
      gl.enableVertexAttribArray(i);
      return offset + f.size * 4;
    }, 0);
  }
  const [pushTexture2D, popTexture2D] = genStack(
    (t) => gl.bindTexture(gl.TEXTURE_2D, t)
  );
  const [pushArrayBuffer, popArrayBuffer] = genStack(
    (b) => gl.bindBuffer(gl.ARRAY_BUFFER, b)
  );
  const [pushElementArrayBuffer, popElementArrayBuffer] = genStack((b) => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b));
  const [pushFramebuffer, popFramebuffer] = genStack(
    (b) => gl.bindFramebuffer(gl.FRAMEBUFFER, b)
  );
  const [pushRenderbuffer, popRenderbuffer] = genStack((b) => gl.bindRenderbuffer(gl.RENDERBUFFER, b));
  const [pushViewport, popViewport] = genStack((stack) => {
    if (!stack) return;
    const { x, y, w, h } = stack;
    gl.viewport(x, y, w, h);
  });
  const [pushProgram, popProgram] = genStack(
    (p) => gl.useProgram(p)
  );
  pushViewport({
    x: 0,
    y: 0,
    w: gl.drawingBufferWidth,
    h: gl.drawingBufferHeight
  });
  return {
    gl,
    opts,
    onDestroy: onDestroy2,
    destroy: destroy2,
    pushTexture2D,
    popTexture2D,
    pushArrayBuffer,
    popArrayBuffer,
    pushElementArrayBuffer,
    popElementArrayBuffer,
    pushFramebuffer,
    popFramebuffer,
    pushRenderbuffer,
    popRenderbuffer,
    pushViewport,
    popViewport,
    pushProgram,
    popProgram,
    setVertexFormat
  };
}

// src/gfx/formatText.ts
var fontAtlases = {};
function applyCharTransform(fchar, tr) {
  if (tr.pos) fchar.pos = fchar.pos.add(tr.pos);
  if (tr.scale) fchar.scale = fchar.scale.scale(vec2(tr.scale));
  if (tr.angle) fchar.angle += tr.angle;
  if (tr.color && fchar.ch.length === 1) {
    fchar.color = fchar.color.mult(tr.color);
  }
  if (tr.opacity != null) fchar.opacity *= tr.opacity;
}
function compileStyledText(text2) {
  const charStyleMap = {};
  let renderText = "";
  let styleStack = [];
  let lastIndex = 0;
  let skipCount = 0;
  for (let i = 0; i < text2.length; i++) {
    if (i !== lastIndex + 1) skipCount += i - lastIndex;
    lastIndex = i;
    if (text2[i] === "\\" && text2[i + 1] === "[") continue;
    if ((i === 0 || text2[i - 1] !== "\\") && text2[i] === "[") {
      const start = i;
      i++;
      let isClosing = text2[i] === "/";
      let style = "";
      if (isClosing) i++;
      while (i < text2.length && text2[i] !== "]") {
        style += text2[i++];
      }
      if (!MULTI_WORD_RE.test(style) || i >= text2.length || text2[i] !== "]" || isClosing && (styleStack.length === 0 || styleStack[styleStack.length - 1][0] !== style)) {
        i = start;
      } else {
        if (!isClosing) styleStack.push([style, start]);
        else styleStack.pop();
        continue;
      }
    }
    renderText += text2[i];
    if (styleStack.length > 0) {
      charStyleMap[i - skipCount] = styleStack.map(([name]) => name);
    }
  }
  if (styleStack.length > 0) {
    while (styleStack.length > 0) {
      const [_, start] = styleStack.pop();
      text2 = text2.substring(0, start) + "\\" + text2.substring(start);
    }
    return compileStyledText(text2);
  }
  return {
    charStyleMap,
    text: renderText
  };
}
function formatText(opt) {
  if (opt.text === void 0) {
    throw new Error('formatText() requires property "text".');
  }
  let font = resolveFont(opt.font);
  if (!opt.text || opt.text === "" || font instanceof Asset || !font) {
    return {
      width: 0,
      height: 0,
      chars: [],
      opt,
      renderedText: ""
    };
  }
  const { charStyleMap, text: text2 } = compileStyledText(opt.text + "");
  const chars = runes(text2);
  if (font instanceof FontData || typeof font === "string") {
    const fontName = font instanceof FontData ? font.fontface.family : font;
    const opts = font instanceof FontData ? {
      outline: font.outline,
      filter: font.filter
    } : {
      outline: null,
      filter: DEF_FONT_FILTER
    };
    const atlas = fontAtlases[fontName] ?? {
      font: {
        tex: new Texture(gfx.ggl, FONT_ATLAS_WIDTH, FONT_ATLAS_HEIGHT, {
          filter: opts.filter
        }),
        map: {},
        size: DEF_TEXT_CACHE_SIZE
      },
      cursor: new Vec2(0),
      outline: opts.outline
    };
    if (!fontAtlases[fontName]) {
      fontAtlases[fontName] = atlas;
    }
    font = atlas.font;
    for (const ch of chars) {
      if (!atlas.font.map[ch]) {
        const c2d = fontCacheC2d;
        if (!c2d) throw new Error("fontCacheC2d is not defined.");
        if (!fontCacheCanvas) {
          throw new Error("fontCacheCanvas is not defined.");
        }
        c2d.clearRect(
          0,
          0,
          fontCacheCanvas.width,
          fontCacheCanvas.height
        );
        c2d.font = `${font.size}px ${fontName}`;
        c2d.textBaseline = "top";
        c2d.textAlign = "left";
        c2d.fillStyle = "#ffffff";
        const m = c2d.measureText(ch);
        let w = Math.ceil(m.width);
        if (!w) continue;
        let h = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
        if (atlas.outline && atlas.outline.width && atlas.outline.color) {
          c2d.lineJoin = "round";
          c2d.lineWidth = atlas.outline.width * 2;
          c2d.strokeStyle = atlas.outline.color.toHex();
          c2d.strokeText(
            ch,
            atlas.outline.width,
            atlas.outline.width
          );
          w += atlas.outline.width * 2;
          h += atlas.outline.width * 3;
        }
        c2d.fillText(
          ch,
          atlas.outline?.width ?? 0,
          atlas.outline?.width ?? 0
        );
        const img = c2d.getImageData(0, 0, w, h);
        if (atlas.cursor.x + w > FONT_ATLAS_WIDTH) {
          atlas.cursor.x = 0;
          atlas.cursor.y += h;
          if (atlas.cursor.y > FONT_ATLAS_HEIGHT) {
            throw new Error(
              "Font atlas exceeds character limit"
            );
          }
        }
        font.tex.update(img, atlas.cursor.x, atlas.cursor.y);
        font.map[ch] = new Quad(
          atlas.cursor.x,
          atlas.cursor.y,
          w,
          h
        );
        atlas.cursor.x += w;
      }
    }
  }
  const size = opt.size || font.size;
  const scale2 = vec2(opt.scale ?? 1).scale(size / font.size);
  const lineSpacing = opt.lineSpacing ?? 0;
  const letterSpacing = opt.letterSpacing ?? 0;
  let curX = 0;
  let tw = 0;
  let th = 0;
  const lines = [];
  let curLine = [];
  let cursor = 0;
  let lastSpace = null;
  let lastSpaceWidth = 0;
  while (cursor < chars.length) {
    let ch = chars[cursor];
    if (ch === "\n") {
      th += size + lineSpacing;
      lines.push({
        width: curX - letterSpacing,
        chars: curLine
      });
      lastSpace = null;
      lastSpaceWidth = 0;
      curX = 0;
      curLine = [];
    } else {
      let q = font.map[ch];
      if (q) {
        let gw = q.w * scale2.x;
        if (opt.width && curX + gw > opt.width) {
          th += size + lineSpacing;
          if (lastSpace != null) {
            cursor -= curLine.length - lastSpace;
            ch = chars[cursor];
            q = font.map[ch];
            gw = q.w * scale2.x;
            curLine = curLine.slice(0, lastSpace - 1);
            curX = lastSpaceWidth;
          }
          lastSpace = null;
          lastSpaceWidth = 0;
          lines.push({
            width: curX - letterSpacing,
            chars: curLine
          });
          curX = 0;
          curLine = [];
        }
        curLine.push({
          tex: font.tex,
          width: q.w,
          height: q.h,
          // without some padding there'll be visual artifacts on edges
          quad: new Quad(
            q.x / font.tex.width,
            q.y / font.tex.height,
            q.w / font.tex.width,
            q.h / font.tex.height
          ),
          ch,
          pos: new Vec2(curX, th),
          opacity: opt.opacity ?? 1,
          color: opt.color ?? Color.WHITE,
          scale: vec2(scale2),
          angle: 0
        });
        if (ch === " ") {
          lastSpace = curLine.length;
          lastSpaceWidth = curX;
        }
        curX += gw;
        tw = Math.max(tw, curX);
        curX += letterSpacing;
      }
    }
    cursor++;
  }
  lines.push({
    width: curX - letterSpacing,
    chars: curLine
  });
  th += size;
  if (opt.width) {
    tw = opt.width;
  }
  const fchars = [];
  for (let i = 0; i < lines.length; i++) {
    const ox = (tw - lines[i].width) * alignPt(opt.align ?? "left");
    for (const fchar of lines[i].chars) {
      const q = font.map[fchar.ch];
      const idx = fchars.length + i;
      fchar.pos = fchar.pos.add(ox, 0).add(
        q.w * scale2.x * 0.5,
        q.h * scale2.y * 0.5
      );
      if (opt.transform) {
        const tr = typeof opt.transform === "function" ? opt.transform(idx, fchar.ch) : opt.transform;
        if (tr) {
          applyCharTransform(fchar, tr);
        }
      }
      if (charStyleMap[idx]) {
        const styles = charStyleMap[idx];
        for (const name of styles) {
          const style = opt.styles?.[name];
          const tr = typeof style === "function" ? style(idx, fchar.ch) : style;
          if (tr) {
            applyCharTransform(fchar, tr);
          }
        }
      }
      fchars.push(fchar);
    }
  }
  return {
    width: tw,
    height: th,
    chars: fchars,
    opt,
    renderedText: text2
  };
}

// src/gfx/draw/drawUVQuad.ts
function drawUVQuad(opt) {
  if (opt.width === void 0 || opt.height === void 0) {
    throw new Error(
      'drawUVQuad() requires property "width" and "height".'
    );
  }
  if (opt.width <= 0 || opt.height <= 0) {
    return;
  }
  const w = opt.width;
  const h = opt.height;
  const anchor2 = anchorPt(opt.anchor || DEF_ANCHOR);
  const offset = anchor2.scale(new Vec2(w, h).scale(-0.5));
  const q = opt.quad || new Quad(0, 0, 1, 1);
  const color2 = opt.color || rgb(255, 255, 255);
  const opacity2 = opt.opacity ?? 1;
  const uvPadX = opt.tex ? UV_PAD / opt.tex.width : 0;
  const uvPadY = opt.tex ? UV_PAD / opt.tex.height : 0;
  const qx = q.x + uvPadX;
  const qy = q.y + uvPadY;
  const qw = q.w - uvPadX * 2;
  const qh = q.h - uvPadY * 2;
  pushTransform();
  pushTranslate(opt.pos);
  pushRotate(opt.angle);
  pushScale(opt.scale);
  pushTranslate(offset);
  drawRaw(
    [
      {
        pos: new Vec2(-w / 2, h / 2),
        uv: new Vec2(
          opt.flipX ? qx + qw : qx,
          opt.flipY ? qy : qy + qh
        ),
        color: color2,
        opacity: opacity2
      },
      {
        pos: new Vec2(-w / 2, -h / 2),
        uv: new Vec2(
          opt.flipX ? qx + qw : qx,
          opt.flipY ? qy + qh : qy
        ),
        color: color2,
        opacity: opacity2
      },
      {
        pos: new Vec2(w / 2, -h / 2),
        uv: new Vec2(
          opt.flipX ? qx : qx + qw,
          opt.flipY ? qy + qh : qy
        ),
        color: color2,
        opacity: opacity2
      },
      {
        pos: new Vec2(w / 2, h / 2),
        uv: new Vec2(
          opt.flipX ? qx : qx + qw,
          opt.flipY ? qy : qy + qh
        ),
        color: color2,
        opacity: opacity2
      }
    ],
    [0, 1, 3, 1, 2, 3],
    opt.fixed,
    opt.tex,
    opt.shader,
    opt.uniform ?? void 0
  );
  popTransform();
}

// src/gfx/draw/drawFormattedText.ts
function drawFormattedText(ftext) {
  pushTransform();
  pushTranslate(ftext.opt.pos);
  pushRotate(ftext.opt.angle);
  pushTranslate(
    anchorPt(ftext.opt.anchor ?? "topleft").add(1, 1).scale(
      ftext.width,
      ftext.height
    ).scale(-0.5)
  );
  ftext.chars.forEach((ch) => {
    drawUVQuad({
      tex: ch.tex,
      width: ch.width,
      height: ch.height,
      pos: ch.pos,
      scale: ch.scale,
      angle: ch.angle,
      color: ch.color,
      opacity: ch.opacity,
      quad: ch.quad,
      anchor: "center",
      uniform: ftext.opt.uniform,
      shader: ftext.opt.shader,
      fixed: ftext.opt.fixed
    });
  });
  popTransform();
}

// src/gfx/draw/drawRect.ts
function drawRect(opt) {
  if (opt.width === void 0 || opt.height === void 0) {
    throw new Error(
      'drawRect() requires property "width" and "height".'
    );
  }
  if (opt.width <= 0 || opt.height <= 0) {
    return;
  }
  const w = opt.width;
  const h = opt.height;
  const anchor2 = anchorPt(opt.anchor || DEF_ANCHOR).add(1, 1);
  const offset = anchor2.scale(new Vec2(w, h).scale(-0.5));
  let pts = [
    new Vec2(0, 0),
    new Vec2(w, 0),
    new Vec2(w, h),
    new Vec2(0, h)
  ];
  if (opt.radius) {
    const maxRadius = Math.min(w, h) / 2;
    const r = Array.isArray(opt.radius) ? opt.radius.map((r2) => Math.min(maxRadius, r2)) : new Array(4).fill(Math.min(maxRadius, opt.radius));
    pts = [
      new Vec2(r[0], 0),
      ...r[1] ? getArcPts(new Vec2(w - r[1], r[1]), r[1], r[1], 270, 360) : [vec2(w, 0)],
      ...r[2] ? getArcPts(new Vec2(w - r[2], h - r[2]), r[2], r[2], 0, 90) : [vec2(w, h)],
      ...r[3] ? getArcPts(new Vec2(r[3], h - r[3]), r[3], r[3], 90, 180) : [vec2(0, h)],
      ...r[0] ? getArcPts(new Vec2(r[0], r[0]), r[0], r[0], 180, 270) : []
    ];
  }
  drawPolygon(Object.assign({}, opt, {
    offset,
    pts,
    ...opt.gradient ? {
      colors: opt.horizontal ? [
        opt.gradient[0],
        opt.gradient[1],
        opt.gradient[1],
        opt.gradient[0]
      ] : [
        opt.gradient[0],
        opt.gradient[0],
        opt.gradient[1],
        opt.gradient[1]
      ]
    } : {}
  }));
}

// src/gfx/draw/drawUnscaled.ts
function drawUnscaled(content) {
  flush();
  const ow = gfx.width;
  const oh = gfx.height;
  gfx.width = gfx.viewport.width;
  gfx.height = gfx.viewport.height;
  content();
  flush();
  gfx.width = ow;
  gfx.height = oh;
}

// src/gfx/draw/drawInspectText.ts
function drawInspectText(pos2, txt) {
  drawUnscaled(() => {
    const pad = vec2(8);
    pushTransform();
    pushTranslate(pos2);
    const ftxt = formatText({
      text: txt,
      font: DBG_FONT,
      size: 16,
      pos: pad,
      color: rgb(255, 255, 255),
      fixed: true
    });
    const bw = ftxt.width + pad.x * 2;
    const bh = ftxt.height + pad.x * 2;
    if (pos2.x + bw >= width()) {
      pushTranslate(vec2(-bw, 0));
    }
    if (pos2.y + bh >= height()) {
      pushTranslate(vec2(0, -bh));
    }
    drawRect({
      width: bw,
      height: bh,
      color: rgb(0, 0, 0),
      radius: 4,
      opacity: 0.8,
      fixed: true
    });
    drawFormattedText(ftxt);
    popTransform();
  });
}

// src/gfx/draw/drawTriangle.ts
function drawTriangle(opt) {
  if (!opt.p1 || !opt.p2 || !opt.p3) {
    throw new Error(
      'drawTriangle() requires properties "p1", "p2" and "p3".'
    );
  }
  return drawPolygon(Object.assign({}, opt, {
    pts: [opt.p1, opt.p2, opt.p3]
  }));
}

// src/gfx/draw/drawDebug.ts
function drawDebug() {
  if (debug.inspect) {
    let inspecting = null;
    for (const obj of game.root.get("*", { recursive: true })) {
      if (obj.c("area") && obj.isHovering()) {
        inspecting = obj;
        break;
      }
    }
    game.root.drawInspect();
    if (inspecting) {
      const lines = [];
      const data = inspecting.inspect();
      for (const tag in data) {
        if (data[tag]) {
          lines.push(`${data[tag]}`);
        } else {
          lines.push(`${tag}`);
        }
      }
      drawInspectText(contentToView(mousePos()), lines.join("\n"));
    }
    drawInspectText(vec2(8), `FPS: ${debug.fps()}`);
  }
  if (debug.paused) {
    drawUnscaled(() => {
      pushTransform();
      pushTranslate(width(), 0);
      pushTranslate(-8, 8);
      const size = 32;
      drawRect({
        width: size,
        height: size,
        anchor: "topright",
        color: rgb(0, 0, 0),
        opacity: 0.8,
        radius: 4,
        fixed: true
      });
      for (let i = 1; i <= 2; i++) {
        drawRect({
          width: 4,
          height: size * 0.6,
          anchor: "center",
          pos: vec2(-size / 3 * i, size * 0.5),
          color: rgb(255, 255, 255),
          radius: 2,
          fixed: true
        });
      }
      popTransform();
    });
  }
  if (debug.timeScale !== 1) {
    drawUnscaled(() => {
      pushTransform();
      pushTranslate(width(), height());
      pushTranslate(-8, -8);
      const pad = 8;
      const ftxt = formatText({
        text: debug.timeScale.toFixed(1),
        font: DBG_FONT,
        size: 16,
        color: rgb(255, 255, 255),
        pos: vec2(-pad),
        anchor: "botright",
        fixed: true
      });
      drawRect({
        width: ftxt.width + pad * 2 + pad * 4,
        height: ftxt.height + pad * 2,
        anchor: "botright",
        color: rgb(0, 0, 0),
        opacity: 0.8,
        radius: 4,
        fixed: true
      });
      for (let i = 0; i < 2; i++) {
        const flipped = debug.timeScale < 1;
        drawTriangle({
          p1: vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad),
          p2: vec2(
            -ftxt.width - pad * (flipped ? 2 : 3.5),
            -pad - ftxt.height
          ),
          p3: vec2(
            -ftxt.width - pad * (flipped ? 3.5 : 2),
            -pad - ftxt.height / 2
          ),
          pos: vec2(-i * pad * 1 + (flipped ? -pad * 0.5 : 0), 0),
          color: rgb(255, 255, 255),
          fixed: true
        });
      }
      drawFormattedText(ftxt);
      popTransform();
    });
  }
  if (debug.curRecording) {
    drawUnscaled(() => {
      pushTransform();
      pushTranslate(0, height());
      pushTranslate(24, -24);
      drawCircle({
        radius: 12,
        color: rgb(255, 0, 0),
        opacity: wave(0, 1, app.time() * 4),
        fixed: true
      });
      popTransform();
    });
  }
  if (debug.showLog && game.logs.length > 0) {
    drawUnscaled(() => {
      pushTransform();
      pushTranslate(0, height());
      pushTranslate(8, -8);
      const pad = 8;
      const logs = [];
      for (const log of game.logs) {
        let str = "";
        const style = log.msg instanceof Error ? "error" : "info";
        str += `[time]${log.time.toFixed(2)}[/time]`;
        str += " ";
        str += `[${style}]${log.msg?.toString ? log.msg.toString() : log.msg}[/${style}]`;
        logs.push(str);
      }
      game.logs = game.logs.filter(
        (log) => app.time() - log.time < (globalOpt.logTime || LOG_TIME)
      );
      const ftext = formatText({
        text: logs.join("\n"),
        font: DBG_FONT,
        pos: vec2(pad, -pad),
        anchor: "botleft",
        size: 16,
        width: width() * 0.6,
        lineSpacing: pad / 2,
        fixed: true,
        styles: {
          "time": { color: rgb(127, 127, 127) },
          "info": { color: rgb(255, 255, 255) },
          "error": { color: rgb(255, 0, 127) }
        }
      });
      drawRect({
        width: ftext.width + pad * 2,
        height: ftext.height + pad * 2,
        anchor: "botleft",
        color: rgb(0, 0, 0),
        radius: 4,
        opacity: 0.8,
        fixed: true
      });
      drawFormattedText(ftext);
      popTransform();
    });
  }
}

// src/gfx/draw/drawFrame.ts
function drawFrame() {
  const cam = game.cam;
  const shake2 = Vec2.fromAngle(rand(0, 360)).scale(cam.shake);
  cam.shake = lerp(cam.shake, 0, 5 * dt());
  cam.transform = new Mat4().translate(center()).scale(cam.scale).rotate(cam.angle).translate((cam.pos ?? center()).scale(-1).add(shake2));
  game.root.draw();
  flush();
}

// src/gfx/draw/drawLoadingScreen.ts
function drawLoadScreen() {
  const progress = loadProgress();
  if (game.events.numListeners("loading") > 0) {
    game.events.trigger("loading", progress);
  } else {
    drawUnscaled(() => {
      const w = width() / 2;
      const h = 24;
      const pos2 = vec2(width() / 2, height() / 2).sub(
        vec2(w / 2, h / 2)
      );
      drawRect({
        pos: vec2(0),
        width: width(),
        height: height(),
        color: rgb(0, 0, 0)
      });
      drawRect({
        pos: pos2,
        width: w,
        height: h,
        fill: false,
        outline: {
          width: 4
        }
      });
      drawRect({
        pos: pos2,
        width: w * progress,
        height: h
      });
    });
  }
}

// src/gfx/draw/drawStenciled.ts
function drawStenciled(content, mask2, test) {
  const gl = gfx.ggl.gl;
  flush();
  gl.clear(gl.STENCIL_BUFFER_BIT);
  gl.enable(gl.STENCIL_TEST);
  gl.stencilFunc(
    gl.NEVER,
    1,
    255
  );
  gl.stencilOp(
    gl.REPLACE,
    gl.REPLACE,
    gl.REPLACE
  );
  mask2();
  flush();
  gl.stencilFunc(
    test,
    1,
    255
  );
  gl.stencilOp(
    gl.KEEP,
    gl.KEEP,
    gl.KEEP
  );
  content();
  flush();
  gl.disable(gl.STENCIL_TEST);
}

// src/gfx/draw/drawMasked.ts
function drawMasked(content, mask2) {
  const gl = gfx.ggl.gl;
  drawStenciled(content, mask2, gl.EQUAL);
}

// src/gfx/draw/drawTexture.ts
function drawTexture(opt) {
  if (!opt.tex) {
    throw new Error('drawTexture() requires property "tex".');
  }
  const q = opt.quad ?? new Quad(0, 0, 1, 1);
  const w = opt.tex.width * q.w;
  const h = opt.tex.height * q.h;
  const scale2 = new Vec2(1);
  if (opt.tiled) {
    const anchor2 = anchorPt(opt.anchor || DEF_ANCHOR).add(
      new Vec2(1, 1)
    ).scale(0.5);
    const offset = anchor2.scale(opt.width || w, opt.height || h);
    const fcols = (opt.width || w) / w;
    const frows = (opt.height || h) / h;
    const cols = Math.floor(fcols);
    const rows = Math.floor(frows);
    const fracX = fcols - cols;
    const fracY = frows - rows;
    const n = (cols + fracX ? 1 : 0) * (rows + fracY ? 1 : 0);
    const indices = new Array(n * 6);
    const vertices = new Array(n * 4);
    let index = 0;
    const addQuad = (x, y, w2, h2, q2) => {
      indices[index * 6 + 0] = index * 4 + 0;
      indices[index * 6 + 1] = index * 4 + 1;
      indices[index * 6 + 2] = index * 4 + 3;
      indices[index * 6 + 3] = index * 4 + 1;
      indices[index * 6 + 4] = index * 4 + 2;
      indices[index * 6 + 5] = index * 4 + 3;
      vertices[index * 4 + 0] = {
        pos: new Vec2(x - offset.x, y - offset.y),
        uv: new Vec2(q2.x, q2.y),
        color: opt.color || Color.WHITE,
        opacity: opt.opacity || 1
      };
      vertices[index * 4 + 1] = {
        pos: new Vec2(x + w2 - offset.x, y - offset.y),
        uv: new Vec2(q2.x + q2.w, q2.y),
        color: opt.color || Color.WHITE,
        opacity: opt.opacity || 1
      };
      vertices[index * 4 + 2] = {
        pos: new Vec2(x + w2 - offset.x, y + h2 - offset.y),
        uv: new Vec2(q2.x + q2.w, q2.y + q2.h),
        color: opt.color || Color.WHITE,
        opacity: opt.opacity || 1
      };
      vertices[index * 4 + 3] = {
        pos: new Vec2(x - offset.x, y + h2 - offset.y),
        uv: new Vec2(q2.x, q2.y + q2.h),
        color: opt.color || Color.WHITE,
        opacity: opt.opacity || 1
      };
      index++;
    };
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        addQuad(i * w, j * h, w, h, q);
      }
      if (fracX) {
        addQuad(
          cols * w,
          j * h,
          w * fracX,
          h,
          new Quad(q.x, q.y, q.w * fracX, q.h)
        );
      }
    }
    if (fracY) {
      for (let i = 0; i < cols; i++) {
        addQuad(
          i * w,
          rows * h,
          w,
          h * fracY,
          new Quad(q.x, q.y, q.w, q.h * fracY)
        );
      }
      if (fracX) {
        addQuad(
          cols * w,
          rows * h,
          w * fracX,
          h * fracY,
          new Quad(q.x, q.y, q.w * fracX, q.h * fracY)
        );
      }
    }
    drawRaw(
      vertices,
      indices,
      opt.fixed,
      opt.tex,
      opt.shader,
      opt.uniform ?? void 0
    );
  } else {
    if (opt.width && opt.height) {
      scale2.x = opt.width / w;
      scale2.y = opt.height / h;
    } else if (opt.width) {
      scale2.x = opt.width / w;
      scale2.y = scale2.x;
    } else if (opt.height) {
      scale2.y = opt.height / h;
      scale2.x = scale2.y;
    }
    drawUVQuad(Object.assign({}, opt, {
      scale: scale2.scale(opt.scale || new Vec2(1)),
      tex: opt.tex,
      quad: q,
      width: w,
      height: h
    }));
  }
}

// src/gfx/draw/drawSprite.ts
function drawSprite(opt) {
  if (!opt.sprite) {
    throw new Error('drawSprite() requires property "sprite"');
  }
  const spr = resolveSprite(opt.sprite);
  if (!spr || !spr.data) {
    return;
  }
  const q = spr.data.frames[opt.frame ?? 0];
  if (!q) {
    throw new Error(`Frame not found: ${opt.frame ?? 0}`);
  }
  drawTexture(Object.assign({}, opt, {
    tex: spr.data.tex,
    quad: q.scale(opt.quad ?? new Quad(0, 0, 1, 1))
  }));
}

// src/gfx/draw/drawSubstracted.ts
function drawSubtracted(content, mask2) {
  const gl = gfx.ggl.gl;
  drawStenciled(content, mask2, gl.NOTEQUAL);
}

// src/gfx/draw/drawText.ts
function drawText(opt) {
  drawFormattedText(formatText(opt));
}

// src/gfx/gfxApp.ts
var initAppGfx = (gopt, ggl) => {
  const defShader = makeShader(ggl, DEF_VERT, DEF_FRAG);
  const pixelDensity2 = gopt.pixelDensity ?? 1;
  const gscale2 = gopt.scale ?? 1;
  const { gl } = ggl;
  const emptyTex = Texture.fromImage(
    ggl,
    new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1)
  );
  const frameBuffer = gopt.width && gopt.height ? new FrameBuffer(
    ggl,
    gopt.width * pixelDensity2 * gscale2,
    gopt.height * pixelDensity2 * gscale2
  ) : new FrameBuffer(
    ggl,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight
  );
  let bgColor = null;
  let bgAlpha = 1;
  if (gopt.background) {
    if (typeof gopt.background === "string") {
      bgColor = rgb(gopt.background);
    } else {
      bgColor = rgb(...gopt.background);
      bgAlpha = gopt.background[3] ?? 1;
    }
    gl.clearColor(
      bgColor.r / 255,
      bgColor.g / 255,
      bgColor.b / 255,
      bgAlpha ?? 1
    );
  }
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA,
    gl.ONE,
    gl.ONE_MINUS_SRC_ALPHA
  );
  const renderer = new BatchRenderer(
    ggl,
    VERTEX_FORMAT,
    MAX_BATCHED_VERTS,
    MAX_BATCHED_INDICES
  );
  const bgTex = Texture.fromImage(
    ggl,
    new ImageData(
      new Uint8ClampedArray([
        128,
        128,
        128,
        255,
        190,
        190,
        190,
        255,
        190,
        190,
        190,
        255,
        128,
        128,
        128,
        255
      ]),
      2,
      2
    ),
    {
      wrap: "repeat",
      filter: "nearest"
    }
  );
  return {
    // how many draw calls we're doing last frame, this is the number we give to users
    lastDrawCalls: 0,
    ggl,
    // gfx states
    defShader,
    defTex: emptyTex,
    frameBuffer,
    postShader: null,
    postShaderUniform: null,
    renderer,
    transform: new Mat4(),
    transformStack: [],
    bgTex,
    bgColor,
    bgAlpha,
    width: gopt.width ?? gl.drawingBufferWidth / pixelDensity2 / gscale2,
    height: gopt.height ?? gl.drawingBufferHeight / pixelDensity2 / gscale2,
    viewport: {
      x: 0,
      y: 0,
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight
    },
    fixed: false
  };
};

// src/gfx/viewport.ts
function updateViewport() {
  const pd = pixelDensity;
  const canvasWidth = gfx.ggl.gl.drawingBufferWidth / pd;
  const canvasHeight = gfx.ggl.gl.drawingBufferHeight / pd;
  if (globalOpt.letterbox) {
    if (!globalOpt.width || !globalOpt.height) {
      throw new Error(
        "Letterboxing requires width and height defined."
      );
    }
    const rc = canvasWidth / canvasHeight;
    const rg = globalOpt.width / globalOpt.height;
    if (rc > rg) {
      const sw = canvasHeight * rg;
      const x = (canvasWidth - sw) / 2;
      gfx.viewport = {
        x,
        y: 0,
        width: sw,
        height: canvasHeight
      };
    } else {
      const sh = canvasWidth / rg;
      const y = (canvasHeight - sh) / 2;
      gfx.viewport = {
        x: 0,
        y,
        width: canvasWidth,
        height: sh
      };
    }
    return;
  }
  if (globalOpt.stretch) {
    if (!globalOpt.width || !globalOpt.height) {
      throw new Error(
        "Stretching requires width and height defined."
      );
    }
  }
  gfx.viewport = {
    x: 0,
    y: 0,
    width: canvasWidth,
    height: canvasHeight
  };
}

// src/game/utils.ts
function isFixed(obj) {
  if (obj.fixed) return true;
  return obj.parent ? isFixed(obj.parent) : false;
}
function getRenderProps(obj) {
  return {
    color: obj.color,
    opacity: obj.opacity,
    anchor: obj.anchor,
    outline: obj.outline,
    shader: obj.shader,
    uniform: obj.uniform
  };
}

// src/components/draw/circle.ts
function circle(radius, opt = {}) {
  return {
    id: "circle",
    radius,
    draw() {
      drawCircle(Object.assign(getRenderProps(this), {
        radius: this.radius,
        fill: opt.fill
      }));
    },
    renderArea() {
      return new Rect(
        new Vec2(this.anchor ? 0 : -this.radius),
        this.radius * 2,
        this.radius * 2
      );
    },
    inspect() {
      return `radius: ${Math.ceil(this.radius)}`;
    }
  };
}

// src/components/draw/color.ts
function color(...args) {
  return {
    id: "color",
    color: rgb(...args),
    inspect() {
      return `color: ${this.color.toString()}`;
    }
  };
}

// src/components/draw/drawon.ts
function drawon(c) {
  return {
    add() {
      this.canvas = c;
    }
  };
}

// src/components/draw/fadeIn.ts
function fadeIn(time = 1) {
  let finalOpacity;
  let t = 0;
  let done = false;
  return {
    require: ["opacity"],
    add() {
      finalOpacity = this.opacity;
      this.opacity = 0;
    },
    update() {
      if (done) return;
      t += dt();
      this.opacity = map(t, 0, time, 0, finalOpacity);
      if (t >= time) {
        this.opacity = finalOpacity;
        done = true;
      }
    }
  };
}

// src/components/draw/mask.ts
function mask(m = "intersect") {
  return {
    id: "mask",
    mask: m
  };
}

// src/components/draw/opacity.ts
function opacity(a) {
  return {
    id: "opacity",
    opacity: a ?? 1,
    fadeIn(time = 1, easeFunc = k.easings.linear) {
      return game.root.tween(
        0,
        this.opacity,
        time,
        (a2) => this.opacity = a2,
        easeFunc
      );
    },
    fadeOut(time = 1, easeFunc = k.easings.linear) {
      return game.root.tween(
        this.opacity,
        0,
        time,
        (a2) => this.opacity = a2,
        easeFunc
      );
    },
    inspect() {
      return `opacity: ${toFixed(this.opacity, 1)}`;
    }
  };
}

// src/components/draw/outline.ts
function outline(width2 = 1, color2 = rgb(0, 0, 0), opacity2 = 1, join = "miter", miterLimit = 10, cap = "butt") {
  return {
    id: "outline",
    outline: {
      width: width2,
      color: color2,
      opacity: opacity2,
      join,
      miterLimit,
      cap
    },
    inspect() {
      return `outline: ${this.outline.width}px, ${this.outline.color}`;
    }
  };
}

// src/components/draw/particles.ts
var Particle = class {
  pos = vec2(0);
  vel = vec2(0);
  acc = vec2(0);
  angle = 0;
  angularVelocity = 0;
  damping = 0;
  t;
  lt = null;
  gc;
  constructor() {
    this.t = 0;
    this.gc = true;
  }
  get progress() {
    return this.lt ? this.t / this.lt : this.t;
  }
};
function particles(popt, eopt) {
  let emitterLifetime = eopt.lifetime;
  const particles2 = [];
  const colors = popt.colors || [Color.WHITE];
  const opacities = popt.opacities || [1];
  const quads = popt.quads || [new Quad(0, 0, 1, 1)];
  const scales = popt.scales || [1];
  const lifetime = popt.lifeTime;
  const direction = eopt.direction;
  const spread = eopt.spread;
  const speed = popt.speed || [0, 0];
  const angleRange = popt.angle || [0, 0];
  const angularVelocityRange = popt.angularVelocity || [0, 0];
  const accelerationRange = popt.acceleration || [vec2(0), vec2(0)];
  const dampingRange = popt.damping || [0, 0];
  const indices = [];
  const vertices = new Array(popt.max);
  let count = 0;
  let time = 0;
  for (let i = 0; i < popt.max; i++) {
    indices[i * 6 + 0] = i * 4 + 0;
    indices[i * 6 + 1] = i * 4 + 1;
    indices[i * 6 + 2] = i * 4 + 3;
    indices[i * 6 + 3] = i * 4 + 1;
    indices[i * 6 + 4] = i * 4 + 2;
    indices[i * 6 + 5] = i * 4 + 3;
    for (let j = 0; j < 4; j++) {
      vertices[i * 4 + j] = {
        pos: new Vec2(0, 0),
        uv: new Vec2(0, 0),
        color: rgb(255, 255, 255),
        opacity: 1
      };
    }
    particles2[i] = new Particle();
  }
  const onEndEvents = new KEvent();
  function nextFree(index = 0) {
    while (index < popt.max) {
      if (particles2[index].gc) {
        return index;
      }
      index++;
    }
    return null;
  }
  return {
    id: "particles",
    emit(n) {
      let index = 0;
      for (let i = 0; i < n; i++) {
        index = nextFree(index);
        if (index == null) return;
        const velocityAngle = rand(
          direction - spread,
          direction + spread
        );
        const vel = Vec2.fromAngle(velocityAngle).scale(
          rand(speed[0], speed[1])
        );
        const angle = rand(angleRange[0], angleRange[1]);
        const angularVelocity = rand(
          angularVelocityRange[0],
          angularVelocityRange[1]
        );
        const acceleration = vec2(
          rand(accelerationRange[0].x, accelerationRange[1].x),
          rand(accelerationRange[0].y, accelerationRange[1].y)
        );
        const damping = rand(
          dampingRange[0],
          dampingRange[1]
        );
        const lt = lifetime ? rand(lifetime[0], lifetime[1]) : null;
        const pos2 = eopt.shape ? eopt.shape.random() : vec2();
        const p = particles2[index];
        p.lt = lt;
        p.pos = pos2;
        p.vel = vel;
        p.acc = acceleration;
        p.angle = angle;
        p.angularVelocity = angularVelocity;
        p.damping = damping;
        p.angularVelocity = angularVelocity;
        p.gc = false;
      }
      count += n;
    },
    update() {
      if (emitterLifetime !== void 0 && emitterLifetime <= 0) {
        return;
      }
      const DT = dt();
      for (const p of particles2) {
        if (p.gc) {
          continue;
        }
        p.t += DT;
        if (p.lt && p.t >= p.lt) {
          p.gc = true;
          count--;
          continue;
        }
        p.vel = p.vel.add(p.acc.scale(DT)).scale(1 - p.damping * DT);
        p.pos = p.pos.add(p.vel.scale(DT));
        p.angle += p.angularVelocity * DT;
      }
      if (emitterLifetime !== void 0) {
        emitterLifetime -= DT;
        if (emitterLifetime <= 0) {
          onEndEvents.trigger();
        }
      }
      time += DT;
      while (count < popt.max && eopt.rate && time > eopt.rate) {
        this.emit(1);
        count++;
        time -= eopt.rate;
      }
    },
    draw() {
      if (emitterLifetime !== void 0 && emitterLifetime <= 0) {
        return;
      }
      for (let i = 0; i < particles2.length; i++) {
        const p = particles2[i];
        if (p.gc) {
          continue;
        }
        const progress = p.progress;
        const colorIndex = Math.floor(p.progress * colors.length);
        const color2 = colorIndex < colors.length - 1 ? lerp(
          colors[colorIndex],
          colors[colorIndex + 1],
          map(
            progress,
            colorIndex / colors.length,
            (colorIndex + 1) / colors.length,
            0,
            1
          )
        ) : colors[colorIndex];
        const opacityIndex = Math.floor(p.progress * opacities.length);
        const opacity2 = opacityIndex < opacities.length - 1 ? lerp(
          opacities[opacityIndex],
          opacities[opacityIndex + 1],
          map(
            progress,
            opacityIndex / opacities.length,
            (opacityIndex + 1) / opacities.length,
            0,
            1
          )
        ) : opacities[opacityIndex];
        const quadIndex = Math.floor(p.progress * quads.length);
        const quad2 = quads[quadIndex];
        const scaleIndex = Math.floor(p.progress * scales.length);
        const scale2 = scales[scaleIndex];
        const c = Math.cos(p.angle * Math.PI / 180);
        const s = Math.sin(p.angle * Math.PI / 180);
        const hw = (popt.texture ? popt.texture.width : 10) * quad2.w / 2;
        const hh = (popt.texture ? popt.texture.height : 10) * quad2.h / 2;
        let j = i * 4;
        let v = vertices[j];
        v.pos.x = p.pos.x + -hw * scale2 * c - -hh * scale2 * s;
        v.pos.y = p.pos.y + -hw * scale2 * s + -hh * scale2 * c;
        v.uv.x = quad2.x;
        v.uv.y = quad2.y;
        v.color.r = color2.r;
        v.color.g = color2.g;
        v.color.b = color2.b;
        v.opacity = opacity2;
        v = vertices[j + 1];
        v.pos.x = p.pos.x + hw * scale2 * c - -hh * scale2 * s;
        v.pos.y = p.pos.y + hw * scale2 * s + -hh * scale2 * c;
        v.uv.x = quad2.x + quad2.w;
        v.uv.y = quad2.y;
        v.color.r = color2.r;
        v.color.g = color2.g;
        v.color.b = color2.b;
        v.opacity = opacity2;
        v = vertices[j + 2];
        v.pos.x = p.pos.x + hw * scale2 * c - hh * scale2 * s;
        v.pos.y = p.pos.y + hw * scale2 * s + hh * scale2 * c;
        v.uv.x = quad2.x + quad2.w;
        v.uv.y = quad2.y + quad2.h;
        v.color.r = color2.r;
        v.color.g = color2.g;
        v.color.b = color2.b;
        v.opacity = opacity2;
        v = vertices[j + 3];
        v.pos.x = p.pos.x + -hw * scale2 * c - hh * scale2 * s;
        v.pos.y = p.pos.y + -hw * scale2 * s + hh * scale2 * c;
        v.uv.x = quad2.x;
        v.uv.y = quad2.y + quad2.h;
        v.color.r = color2.r;
        v.color.g = color2.g;
        v.color.b = color2.b;
        v.opacity = opacity2;
      }
      drawRaw(
        vertices,
        indices,
        this.fixed,
        popt.texture,
        this.shader,
        this.uniform
      );
    },
    onEnd(action) {
      return onEndEvents.add(action);
    },
    inspect() {
      return `count: ${count}/${popt.max}`;
    }
  };
}

// src/components/draw/polygon.ts
function polygon(pts, opt = {}) {
  if (pts.length < 3) {
    throw new Error(
      `Polygon's need more than two points, ${pts.length} points provided`
    );
  }
  return {
    id: "polygon",
    pts,
    colors: opt.colors,
    uv: opt.uv,
    tex: opt.tex,
    radius: opt.radius,
    draw() {
      drawPolygon(Object.assign(getRenderProps(this), {
        pts: this.pts,
        colors: this.colors,
        uv: this.uv,
        tex: this.tex,
        radius: this.radius,
        fill: opt.fill,
        triangulate: opt.triangulate
      }));
    },
    renderArea() {
      return new Polygon(this.pts);
    },
    inspect() {
      return `polygon: ${this.pts.map((p) => `[${p.x},${p.y}]`).join(",")}`;
    }
  };
}

// src/components/draw/raycast.ts
function raycast(origin, direction, exclude) {
  let minHit;
  const shapes = game.root.get("area");
  shapes.forEach((s) => {
    if (exclude && exclude.some((tag) => s.is(tag))) return;
    const shape = s.worldArea();
    const hit = shape.raycast(origin, direction);
    if (hit) {
      if (minHit) {
        if (hit.fraction < minHit.fraction) {
          minHit = hit;
          minHit.object = s;
        }
      } else {
        minHit = hit;
        minHit.object = s;
      }
    }
  });
  return minHit;
}

// src/components/draw/rect.ts
function rect(w, h, opt = {}) {
  return {
    id: "rect",
    width: w,
    height: h,
    radius: opt.radius || 0,
    draw() {
      drawRect(Object.assign(getRenderProps(this), {
        width: this.width,
        height: this.height,
        radius: this.radius,
        fill: opt.fill
      }));
    },
    renderArea() {
      return new Rect(vec2(0), this.width, this.height);
    },
    inspect() {
      return `rect: (${Math.ceil(this.width)}w, ${Math.ceil(this.height)}h)`;
    }
  };
}

// src/components/draw/shader.ts
function shader(id, uniform) {
  return {
    id: "shader",
    shader: id,
    ...typeof uniform === "function" ? {
      uniform: uniform(),
      update() {
        this.uniform = uniform();
      }
    } : {
      uniform
    },
    inspect() {
      return `shader: ${id}`;
    }
  };
}

// src/game/camera.ts
function camPos(...pos2) {
  if (pos2.length > 0) {
    game.cam.pos = vec2(...pos2);
  }
  return game.cam.pos ? game.cam.pos.clone() : center();
}
function camScale(...scale2) {
  if (scale2.length > 0) {
    game.cam.scale = vec2(...scale2);
  }
  return game.cam.scale.clone();
}
function camRot(angle) {
  if (angle !== void 0) {
    game.cam.angle = angle;
  }
  return game.cam.angle;
}
function camFlash(flashColor = rgb(255, 255, 255), fadeOutTime = 1) {
  let flash = game.root.add([
    rect(width(), height()),
    color(flashColor),
    opacity(1),
    fixed()
  ]);
  let fade = flash.fadeOut(fadeOutTime);
  fade.onEnd(() => destroy(flash));
  return fade;
}
function camTransform() {
  return game.cam.transform.clone();
}
function shake(intensity = 12) {
  game.cam.shake += intensity;
}
function toScreen(p) {
  return game.cam.transform.multVec2(p);
}
function toWorld(p) {
  return game.cam.transform.invert().multVec2(p);
}

// src/game/level.ts
function addLevel(map2, opt) {
  if (!opt.tileWidth || !opt.tileHeight) {
    throw new Error("Must provide tileWidth and tileHeight.");
  }
  const level = game.root.add([
    pos(opt.pos ?? vec2(0))
  ]);
  const numRows = map2.length;
  let numColumns = 0;
  let spatialMap = null;
  let costMap = null;
  let edgeMap = null;
  let connectivityMap = null;
  const tile2Hash = (tilePos) => tilePos.x + tilePos.y * numColumns;
  const hash2Tile = (hash) => vec2(
    Math.floor(hash % numColumns),
    Math.floor(hash / numColumns)
  );
  const createSpatialMap = () => {
    spatialMap = [];
    for (const child of level.children) {
      insertIntoSpatialMap(child);
    }
  };
  const insertIntoSpatialMap = (obj) => {
    const i = tile2Hash(obj.tilePos);
    if (spatialMap[i]) {
      spatialMap[i].push(obj);
    } else {
      spatialMap[i] = [obj];
    }
  };
  const removeFromSpatialMap = (obj) => {
    const i = tile2Hash(obj.tilePos);
    if (spatialMap[i]) {
      const index = spatialMap[i].indexOf(obj);
      if (index >= 0) {
        spatialMap[i].splice(index, 1);
      }
    }
  };
  const updateSpatialMap = () => {
    let spatialMapChanged = false;
    for (const child of level.children) {
      const tilePos = level.pos2Tile(child.pos);
      if (child.tilePos.x != tilePos.x || child.tilePos.y != tilePos.y) {
        spatialMapChanged = true;
        removeFromSpatialMap(child);
        child.tilePos.x = tilePos.x;
        child.tilePos.y = tilePos.y;
        insertIntoSpatialMap(child);
      }
    }
    if (spatialMapChanged) {
      level.trigger("spatialMapChanged");
    }
  };
  const createCostMap = () => {
    const spatialMap2 = level.getSpatialMap();
    const size = level.numRows() * level.numColumns();
    if (!costMap) {
      costMap = new Array(size);
    } else {
      costMap.length = size;
    }
    costMap.fill(1, 0, size);
    for (let i = 0; i < spatialMap2.length; i++) {
      const objects = spatialMap2[i];
      if (objects) {
        let cost = 0;
        for (const obj of objects) {
          if (obj.isObstacle) {
            cost = Infinity;
            break;
          } else {
            cost += obj.cost;
          }
        }
        costMap[i] = cost || 1;
      }
    }
  };
  const createEdgeMap = () => {
    const spatialMap2 = level.getSpatialMap();
    const size = level.numRows() * level.numColumns();
    if (!edgeMap) {
      edgeMap = new Array(size);
    } else {
      edgeMap.length = size;
    }
    edgeMap.fill(15 /* All */, 0, size);
    for (let i = 0; i < spatialMap2.length; i++) {
      const objects = spatialMap2[i];
      if (objects) {
        const len = objects.length;
        let mask2 = 15 /* All */;
        for (let j = 0; j < len; j++) {
          mask2 |= objects[j].edgeMask;
        }
        edgeMap[i] = mask2;
      }
    }
  };
  const createConnectivityMap = () => {
    const size = level.numRows() * level.numColumns();
    const traverse = (i, index2) => {
      const frontier = [];
      frontier.push(i);
      while (frontier.length > 0) {
        const i2 = frontier.pop();
        getNeighbours(i2).forEach((i3) => {
          if (connectivityMap[i3] < 0) {
            connectivityMap[i3] = index2;
            frontier.push(i3);
          }
        });
      }
    };
    if (!connectivityMap) {
      connectivityMap = new Array(size);
    } else {
      connectivityMap.length = size;
    }
    connectivityMap.fill(-1, 0, size);
    let index = 0;
    for (let i = 0; i < costMap.length; i++) {
      if (connectivityMap[i] >= 0) {
        index++;
        continue;
      }
      traverse(i, index);
      index++;
    }
  };
  const getCost = (node, neighbour) => {
    return costMap[neighbour];
  };
  const getHeuristic = (node, goal) => {
    const p1 = hash2Tile(node);
    const p2 = hash2Tile(goal);
    return p1.dist(p2);
  };
  const getNeighbours = (node, diagonals) => {
    const n = [];
    const x = Math.floor(node % numColumns);
    const left = x > 0 && edgeMap[node] & 1 /* Left */ && costMap[node - 1] !== Infinity;
    const top = node >= numColumns && edgeMap[node] & 2 /* Top */ && costMap[node - numColumns] !== Infinity;
    const right = x < numColumns - 1 && edgeMap[node] & 4 /* Right */ && costMap[node + 1] !== Infinity;
    const bottom = node < numColumns * numRows - numColumns - 1 && edgeMap[node] & 8 /* Bottom */ && costMap[node + numColumns] !== Infinity;
    if (diagonals) {
      if (left) {
        if (top) n.push(node - numColumns - 1);
        n.push(node - 1);
        if (bottom) n.push(node + numColumns - 1);
      }
      if (top) {
        n.push(node - numColumns);
      }
      if (right) {
        if (top) n.push(node - numColumns + 1);
        n.push(node + 1);
        if (bottom) n.push(node + numColumns + 1);
      }
      if (bottom) {
        n.push(node + numColumns);
      }
    } else {
      if (left) {
        n.push(node - 1);
      }
      if (top) {
        n.push(node - numColumns);
      }
      if (right) {
        n.push(node + 1);
      }
      if (bottom) {
        n.push(node + numColumns);
      }
    }
    return n;
  };
  const levelComp = {
    id: "level",
    tileWidth() {
      return opt.tileWidth;
    },
    tileHeight() {
      return opt.tileHeight;
    },
    spawn(key, ...args) {
      const p = vec2(...args);
      const comps = (() => {
        if (typeof key === "string") {
          if (opt.tiles[key]) {
            if (typeof opt.tiles[key] !== "function") {
              throw new Error(
                "Level symbol def must be a function returning a component list"
              );
            }
            return opt.tiles[key](p);
          } else if (opt.wildcardTile) {
            return opt.wildcardTile(key, p);
          }
        } else if (Array.isArray(key)) {
          return key;
        } else {
          throw new Error(
            "Expected a symbol or a component list"
          );
        }
      })();
      if (!comps) {
        return null;
      }
      let hasPos = false;
      let hasTile = false;
      for (const comp of comps) {
        if (comp.id === "tile") hasTile = true;
        if (comp.id === "pos") hasPos = true;
      }
      if (!hasPos) comps.push(pos());
      if (!hasTile) comps.push(tile());
      const obj = level.add(comps);
      if (hasPos) {
        obj.tilePosOffset = obj.pos.clone();
      }
      obj.tilePos = p;
      if (spatialMap) {
        insertIntoSpatialMap(obj);
        this.trigger("spatialMapChanged");
        this.trigger("navigationMapInvalid");
      }
      return obj;
    },
    numColumns() {
      return numColumns;
    },
    numRows() {
      return numRows;
    },
    levelWidth() {
      return numColumns * this.tileWidth();
    },
    levelHeight() {
      return numRows * this.tileHeight();
    },
    tile2Pos(...args) {
      return vec2(...args).scale(this.tileWidth(), this.tileHeight());
    },
    pos2Tile(...args) {
      const p = vec2(...args);
      return vec2(
        Math.floor(p.x / this.tileWidth()),
        Math.floor(p.y / this.tileHeight())
      );
    },
    getSpatialMap() {
      if (!spatialMap) {
        createSpatialMap();
      }
      return spatialMap;
    },
    onSpatialMapChanged(cb) {
      return this.on("spatialMapChanged", cb);
    },
    onNavigationMapInvalid(cb) {
      return this.on("navigationMapInvalid", cb);
    },
    getAt(tilePos) {
      if (!spatialMap) {
        createSpatialMap();
      }
      const hash = tile2Hash(tilePos);
      return spatialMap[hash] || [];
    },
    raycast(origin, direction) {
      const levelOrigin = origin.scale(
        1 / this.tileWidth(),
        1 / this.tileHeight()
      );
      const hit = raycastGrid(levelOrigin, direction, (tilePos) => {
        const tiles = this.getAt(tilePos);
        if (tiles.some((t) => t.isObstacle)) {
          return true;
        }
        let minHit = null;
        for (const tile2 of tiles) {
          if (tile2.is("area")) {
            const shape = tile2.worldArea();
            const hit2 = shape.raycast(
              origin,
              direction
            );
            if (hit2) {
              if (minHit) {
                if (hit2.fraction < minHit.fraction) {
                  minHit = hit2;
                  minHit.object = tile2;
                }
              } else {
                minHit = hit2;
                minHit.object = tile2;
              }
            }
          }
        }
        return minHit || false;
      }, 64);
      if (hit) {
        hit.point = hit.point.scale(
          this.tileWidth(),
          this.tileHeight()
        );
      }
      return hit;
    },
    update() {
      if (spatialMap) {
        updateSpatialMap();
      }
    },
    invalidateNavigationMap() {
      costMap = null;
      edgeMap = null;
      connectivityMap = null;
    },
    onNavigationMapChanged(cb) {
      return this.on("navigationMapChanged", cb);
    },
    getTilePath(from, to, opts = {}) {
      if (!costMap) {
        createCostMap();
      }
      if (!edgeMap) {
        createEdgeMap();
      }
      if (!connectivityMap) {
        createConnectivityMap();
      }
      if (from.x < 0 || from.x >= numColumns || from.y < 0 || from.y >= numRows) {
        return null;
      }
      if (to.x < 0 || to.x >= numColumns || to.y < 0 || to.y >= numRows) {
        return null;
      }
      const start = tile2Hash(from);
      const goal = tile2Hash(to);
      if (costMap[goal] === Infinity) {
        return null;
      }
      if (start === goal) {
        return [];
      }
      if (connectivityMap[start] != -1 && connectivityMap[start] !== connectivityMap[goal]) {
        return null;
      }
      const frontier = new BinaryHeap(
        (a, b) => a.cost < b.cost
      );
      frontier.insert({ cost: 0, node: start });
      const cameFrom = /* @__PURE__ */ new Map();
      cameFrom.set(start, start);
      const costSoFar = /* @__PURE__ */ new Map();
      costSoFar.set(start, 0);
      while (frontier.length !== 0) {
        const current = frontier.remove()?.node;
        if (current === goal) {
          break;
        }
        const neighbours = getNeighbours(
          current,
          opts.allowDiagonals
        );
        for (const next of neighbours) {
          const newCost = (costSoFar.get(current) || 0) + getCost(current, next) + getHeuristic(next, goal);
          if (!costSoFar.has(next) || newCost < costSoFar.get(next)) {
            costSoFar.set(next, newCost);
            frontier.insert({ cost: newCost, node: next });
            cameFrom.set(next, current);
          }
        }
      }
      const path = [];
      let node = goal;
      const p = hash2Tile(node);
      path.push(p);
      while (node !== start) {
        let cameNode = cameFrom.get(node);
        if (!cameNode) {
          throw new Error("Bug in pathfinding algorithm");
        }
        node = cameNode;
        const p2 = hash2Tile(node);
        path.push(p2);
      }
      return path.reverse();
    },
    getPath(from, to, opts = {}) {
      const tw = this.tileWidth();
      const th = this.tileHeight();
      const path = this.getTilePath(
        this.pos2Tile(from),
        this.pos2Tile(to),
        opts
      );
      if (path) {
        return [
          from,
          ...path.slice(1, -1).map(
            (tilePos) => tilePos.scale(tw, th).add(tw / 2, th / 2)
          ),
          to
        ];
      } else {
        return null;
      }
    }
  };
  level.use(levelComp);
  level.onNavigationMapInvalid(() => {
    level.invalidateNavigationMap();
    level.trigger("navigationMapChanged");
  });
  map2.forEach((row, i) => {
    const keys = row.split("");
    numColumns = Math.max(keys.length, numColumns);
    keys.forEach((key, j) => {
      level.spawn(key, vec2(j, i));
    });
  });
  return level;
}

// src/game/events/events.ts
function on(event, tag, cb) {
  if (!game.objEvents.registers[event]) {
    game.objEvents.registers[event] = new Registry();
  }
  return game.objEvents.on(event, (obj, ...args) => {
    if (obj.is(tag)) {
      cb(obj, ...args);
    }
  });
}
var onFixedUpdate = overload2(
  (action) => {
    const obj = game.root.add([{ fixedUpdate: action }]);
    return {
      get paused() {
        return obj.paused;
      },
      set paused(p) {
        obj.paused = p;
      },
      cancel: () => obj.destroy()
    };
  },
  (tag, action) => {
    return on("fixedUpdate", tag, action);
  }
);
var onUpdate = overload2((action) => {
  const obj = game.root.add([{ update: action }]);
  return {
    get paused() {
      return obj.paused;
    },
    set paused(p) {
      obj.paused = p;
    },
    cancel: () => obj.destroy()
  };
}, (tag, action) => {
  return on("update", tag, action);
});
var onDraw = overload2((action) => {
  const obj = game.root.add([{ draw: action }]);
  return {
    get paused() {
      return obj.hidden;
    },
    set paused(p) {
      obj.hidden = p;
    },
    cancel: () => obj.destroy()
  };
}, (tag, action) => {
  return on("draw", tag, action);
});
var onAdd = overload2((action) => {
  return game.events.on("add", action);
}, (tag, action) => {
  return on("add", tag, action);
});
var onDestroy = overload2((action) => {
  return game.events.on("destroy", action);
}, (tag, action) => {
  return on("destroy", tag, action);
});
function onCollide(t1, t2, f) {
  return on("collide", t1, (a, b, col) => b.is(t2) && f(a, b, col));
}
function onCollideUpdate(t1, t2, f) {
  return on("collideUpdate", t1, (a, b, col) => b.is(t2) && f(a, b, col));
}
function onCollideEnd(t1, t2, f) {
  return on("collideEnd", t1, (a, b, col) => b.is(t2) && f(a, b, col));
}
function forAllCurrentAndFuture(t, action) {
  game.root.get(t, { recursive: true }).forEach(action);
  onAdd(t, action);
}
var onClick = overload2((action) => {
  return app.onMousePress(action);
}, (tag, action) => {
  const events = [];
  forAllCurrentAndFuture(tag, (obj) => {
    if (!obj.area) {
      throw new Error(
        "onClick() requires the object to have area() component"
      );
    }
    events.push(obj.onClick(() => action(obj)));
  });
  return KEventController.join(events);
});
function onHover(t, action) {
  const events = [];
  forAllCurrentAndFuture(t, (obj) => {
    if (!obj.area) {
      throw new Error(
        "onHover() requires the object to have area() component"
      );
    }
    events.push(obj.onHover(() => action(obj)));
  });
  return KEventController.join(events);
}
function onHoverUpdate(t, action) {
  const events = [];
  forAllCurrentAndFuture(t, (obj) => {
    if (!obj.area) {
      throw new Error(
        "onHoverUpdate() requires the object to have area() component"
      );
    }
    events.push(obj.onHoverUpdate(() => action(obj)));
  });
  return KEventController.join(events);
}
function onHoverEnd(t, action) {
  const events = [];
  forAllCurrentAndFuture(t, (obj) => {
    if (!obj.area) {
      throw new Error(
        "onHoverEnd() requires the object to have area() component"
      );
    }
    events.push(obj.onHoverEnd(() => action(obj)));
  });
  return KEventController.join(events);
}
function onLoading(action) {
  game.events.on("loading", action);
}
function onResize(action) {
  app.onResize(action);
}
function onError(action) {
  game.events.on("error", action);
}
function onLoad(cb) {
  if (assets.loaded) {
    cb();
  } else {
    game.events.on("load", cb);
  }
}

// src/game/make.ts
function make(comps = []) {
  const compStates = /* @__PURE__ */ new Map();
  const anonymousCompStates = [];
  const cleanups = {};
  const events = new KEventHandler();
  const inputEvents = [];
  let onCurCompCleanup = null;
  let paused = false;
  const obj = {
    id: uid(),
    // TODO: a nice way to hide / pause when add()-ing
    hidden: false,
    transform: new Mat4(),
    children: [],
    parent: null,
    set paused(p) {
      if (p === paused) return;
      paused = p;
      for (const e of inputEvents) {
        e.paused = p;
      }
    },
    get paused() {
      return paused;
    },
    get tags() {
      const tags = [];
      for (const [key, value] of compStates.entries()) {
        if (Object.keys(value).length == 1) {
          tags.push(key);
        }
      }
      return tags;
    },
    add(a) {
      const obj2 = Array.isArray(a) ? make(a) : a;
      if (obj2.parent) {
        throw new Error(
          "Cannot add a game obj that already has a parent."
        );
      }
      obj2.parent = this;
      obj2.transform = calcTransform(obj2);
      this.children.push(obj2);
      obj2.trigger("add", obj2);
      game.events.trigger("add", obj2);
      return obj2;
    },
    readd(obj2) {
      const idx = this.children.indexOf(obj2);
      if (idx !== -1) {
        this.children.splice(idx, 1);
        this.children.push(obj2);
      }
      return obj2;
    },
    remove(obj2) {
      const idx = this.children.indexOf(obj2);
      if (idx !== -1) {
        obj2.parent = null;
        this.children.splice(idx, 1);
        const trigger = (o) => {
          o.trigger("destroy");
          game.events.trigger("destroy", o);
          o.children.forEach((child) => trigger(child));
        };
        trigger(obj2);
      }
    },
    // TODO: recursive
    removeAll(tag) {
      if (tag) {
        this.get(tag).forEach((obj2) => this.remove(obj2));
      } else {
        for (const child of [...this.children]) this.remove(child);
      }
    },
    fixedUpdate() {
      if (this.paused) return;
      this.children.forEach((child) => child.fixedUpdate());
      this.trigger("fixedUpdate");
    },
    update() {
      if (this.paused) return;
      this.children.forEach((child) => child.update());
      this.trigger("update");
    },
    draw() {
      if (this.hidden) return;
      if (this.canvas) {
        flush();
        this.canvas.bind();
      }
      const f = gfx.fixed;
      if (this.fixed) gfx.fixed = true;
      pushTransform();
      pushTranslate(this.pos);
      pushScale(this.scale);
      pushRotate(this.angle);
      const children = this.children.sort((o1, o2) => {
        const l1 = o1.layerIndex ?? game.defaultLayerIndex;
        const l2 = o2.layerIndex ?? game.defaultLayerIndex;
        return l1 - l2 || (o1.z ?? 0) - (o2.z ?? 0);
      });
      if (this.mask) {
        const maskFunc = {
          intersect: k.drawMasked,
          subtract: k.drawSubtracted
        }[this.mask];
        if (!maskFunc) {
          throw new Error(`Invalid mask func: "${this.mask}"`);
        }
        maskFunc(() => {
          children.forEach((child) => child.draw());
        }, () => {
          this.trigger("draw");
        });
      } else {
        this.trigger("draw");
        children.forEach((child) => child.draw());
      }
      popTransform();
      gfx.fixed = f;
      if (this.canvas) {
        flush();
        this.canvas.unbind();
      }
    },
    drawInspect() {
      if (this.hidden) return;
      pushTransform();
      pushTranslate(this.pos);
      pushScale(this.scale);
      pushRotate(this.angle);
      this.children.forEach((child) => child.drawInspect());
      this.trigger("drawInspect");
      popTransform();
    },
    // use a comp or a tag
    use(comp) {
      if (!comp) {
        return;
      }
      if (isClass(comp)) comp = new comp(this);
      if (typeof comp === "function") {
        return this.use(
          comp(this)
        );
      }
      if (typeof comp === "string") {
        return this.use({
          id: comp
        });
      }
      let gc = [];
      if (comp.id) {
        this.unuse(comp.id);
        cleanups[comp.id] = [];
        gc = cleanups[comp.id];
        compStates.set(comp.id, comp);
      } else {
        anonymousCompStates.push(comp);
      }
      for (const k5 in comp) {
        if (COMP_DESC.has(k5)) {
          continue;
        }
        const prop = Object.getOwnPropertyDescriptor(comp, k5);
        if (!prop) continue;
        if (typeof prop.value === "function") {
          comp[k5] = comp[k5].bind(this);
        }
        if (prop.set) {
          Object.defineProperty(comp, k5, {
            set: prop.set.bind(this)
          });
        }
        if (prop.get) {
          Object.defineProperty(comp, k5, {
            get: prop.get.bind(this)
          });
        }
        if (COMP_EVENTS.has(k5)) {
          const func = k5 === "add" ? () => {
            onCurCompCleanup = (c) => gc.push(c);
            comp[k5]?.();
            onCurCompCleanup = null;
          } : comp[k5];
          gc.push(this.on(k5, func).cancel);
        } else {
          if (this[k5] === void 0) {
            Object.defineProperty(this, k5, {
              get: () => comp[k5],
              set: (val) => comp[k5] = val,
              configurable: true,
              enumerable: true
            });
            gc.push(() => delete this[k5]);
          } else {
            throw new Error(
              `Duplicate component property: "${k5}"`
            );
          }
        }
      }
      const checkDeps = () => {
        if (!comp.require) return;
        for (const dep of comp.require) {
          if (!this.c(dep)) {
            throw new Error(
              `Component "${comp.id}" requires component "${dep}"`
            );
          }
        }
      };
      if (comp.destroy) {
        gc.push(comp.destroy.bind(this));
      }
      if (this.exists()) {
        checkDeps();
        if (comp.add) {
          onCurCompCleanup = (c) => gc.push(c);
          comp.add.call(this);
          onCurCompCleanup = null;
        }
      } else {
        if (comp.require) {
          gc.push(this.on("add", checkDeps).cancel);
        }
      }
    },
    unuse(id) {
      if (compStates.has(id)) {
        for (const comp of compStates.values()) {
          if (comp.require && comp.require.includes(id)) {
            throw new Error(
              `Can't unuse. Component "${comp.id}" requires component "${id}"`
            );
          }
        }
        compStates.delete(id);
      }
      if (cleanups[id]) {
        cleanups[id].forEach((e) => e());
        delete cleanups[id];
      }
    },
    c(id) {
      return compStates.get(id) ?? null;
    },
    // TODO: Separate
    get(t, opts = {}) {
      let list = opts.recursive ? this.children.flatMap(
        function recurse(child) {
          return [child, ...child.children.flatMap(recurse)];
        }
      ) : this.children;
      list = list.filter((child) => t ? child.is(t) : true);
      if (opts.liveUpdate) {
        const isChild = (obj2) => {
          return opts.recursive ? this.isAncestorOf(obj2) : obj2.parent === this;
        };
        const events2 = [];
        events2.push(k.onAdd((obj2) => {
          if (isChild(obj2) && obj2.is(t)) {
            list.push(obj2);
          }
        }));
        events2.push(k.onDestroy((obj2) => {
          if (isChild(obj2) && obj2.is(t)) {
            const idx = list.findIndex((o) => o.id === obj2.id);
            if (idx !== -1) {
              list.splice(idx, 1);
            }
          }
        }));
        this.onDestroy(() => {
          for (const ev of events2) {
            ev.cancel();
          }
        });
      }
      return list;
    },
    query(opt) {
      const hierarchy = opt.hierarchy || "children";
      const include = opt.include;
      const exclude = opt.exclude;
      let list = [];
      switch (hierarchy) {
        case "children":
          list = this.children;
          break;
        case "siblings":
          list = this.parent ? this.parent.children.filter(
            (o) => o !== this
          ) : [];
          break;
        case "ancestors":
          let parent = this.parent;
          while (parent) {
            list.push(parent);
            parent = parent.parent;
          }
          break;
        case "descendants":
          list = this.children.flatMap(
            function recurse(child) {
              return [
                child,
                ...child.children.flatMap(recurse)
              ];
            }
          );
          break;
      }
      if (include) {
        const includeOp = opt.includeOp || "and";
        if (includeOp === "and" || !Array.isArray(opt.include)) {
          list = list.filter((o) => o.is(include));
        } else {
          list = list.filter(
            (o) => opt.include.some((t) => o.is(t))
          );
        }
      }
      if (exclude) {
        const excludeOp = opt.includeOp || "and";
        if (excludeOp === "and" || !Array.isArray(opt.include)) {
          list = list.filter((o) => !o.is(exclude));
        } else {
          list = list.filter(
            (o) => !opt.exclude.some((t) => o.is(t))
          );
        }
      }
      if (opt.visible === true) {
        list = list.filter((o) => o.visible);
      }
      if (opt.distance) {
        if (!this.pos) {
          throw Error(
            "Can't do a distance query from an object without pos"
          );
        }
        const distanceOp = opt.distanceOp || "near";
        const sdist = opt.distance * opt.distance;
        if (distanceOp === "near") {
          list = list.filter(
            (o) => o.pos && this.pos.sdist(o.pos) <= sdist
          );
        } else {
          list = list.filter(
            (o) => o.pos && this.pos.sdist(o.pos) > sdist
          );
        }
      }
      if (opt.name) {
        list = list.filter((o) => o.name === opt.name);
      }
      return list;
    },
    isAncestorOf(obj2) {
      if (!obj2.parent) {
        return false;
      }
      return obj2.parent === this || this.isAncestorOf(obj2.parent);
    },
    exists() {
      return game.root.isAncestorOf(this);
    },
    is(tag) {
      if (tag === "*") {
        return true;
      }
      if (Array.isArray(tag)) {
        for (const t of tag) {
          if (!this.c(t)) {
            return false;
          }
        }
        return true;
      } else {
        return this.c(tag) != null;
      }
    },
    on(name, action) {
      const ctrl = events.on(name, action.bind(this));
      if (onCurCompCleanup) {
        onCurCompCleanup(() => ctrl.cancel());
      }
      return ctrl;
    },
    trigger(name, ...args) {
      events.trigger(name, ...args);
      game.objEvents.trigger(name, this, ...args);
    },
    destroy() {
      if (this.parent) {
        this.parent.remove(this);
      }
    },
    inspect() {
      const info = {};
      for (const [tag, comp] of compStates) {
        info[tag] = comp.inspect?.() ?? null;
      }
      for (const [i, comp] of anonymousCompStates.entries()) {
        if (comp.inspect) {
          info[i] = comp.inspect();
          continue;
        }
        for (const [key, value] of Object.entries(comp)) {
          if (typeof value === "function") {
            continue;
          } else {
            info[key] = `${key}: ${value}`;
          }
        }
      }
      return info;
    },
    onAdd(cb) {
      return this.on("add", cb);
    },
    onFixedUpdate(cb) {
      return this.on("fixedUpdate", cb);
    },
    onUpdate(cb) {
      return this.on("update", cb);
    },
    onDraw(cb) {
      return this.on("draw", cb);
    },
    onDestroy(action) {
      return this.on("destroy", action);
    },
    clearEvents() {
      events.clear();
    }
  };
  const evs = [
    "onKeyPress",
    "onKeyPressRepeat",
    "onKeyDown",
    "onKeyRelease",
    "onMousePress",
    "onMouseDown",
    "onMouseRelease",
    "onMouseMove",
    "onCharInput",
    "onMouseMove",
    "onTouchStart",
    "onTouchMove",
    "onTouchEnd",
    "onScroll",
    "onGamepadButtonPress",
    "onGamepadButtonDown",
    "onGamepadButtonRelease",
    "onGamepadStick",
    "onButtonPress",
    "onButtonDown",
    "onButtonRelease"
  ];
  for (const e of evs) {
    obj[e] = (...args) => {
      const ev = app[e]?.(...args);
      inputEvents.push(ev);
      obj.onDestroy(() => ev.cancel());
      return ev;
    };
  }
  for (const comp of comps) {
    obj.use(comp);
  }
  return obj;
}

// src/game/game.ts
var initGame = () => {
  const game2 = {
    // general events
    events: new KEventHandler(),
    // object events
    objEvents: new KEventHandler(),
    // root game object
    root: make([]),
    // misc
    gravity: null,
    scenes: {},
    currentScene: null,
    layers: null,
    defaultLayerIndex: 0,
    // on screen log
    logs: [],
    // camera
    cam: {
      pos: null,
      scale: new Vec2(1),
      angle: 0,
      shake: 0,
      transform: new Mat4()
    }
  };
  return game2;
};

// src/game/gravity.ts
function setGravity(g) {
  game.gravity = g ? (game.gravity || vec2(0, 1)).unit().scale(g) : null;
}
function getGravity() {
  return game.gravity ? game.gravity.len() : 0;
}
function setGravityDirection(d) {
  game.gravity = d.unit().scale(game.gravity ? game.gravity.len() : 1);
}
function getGravityDirection() {
  return game.gravity ? game.gravity.unit() : vec2(0, 1);
}

// src/kassets/burp.mp3
var burp_default = __toBinary("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L5QNSqT5iiySS9Ja2SV//5ME0ak//+4KgAAABgQBAADAMDgYCAEgCteQ0fZH6+ICXA357+MPfhR/+ywRf/U///LVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JknQAFoWhGLm5gBClBmT3GiAAAAAGkHAAAIAAANIOAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");

// src/audio/audio.ts
var initAudio = () => {
  const audio2 = (() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const masterNode = ctx.createGain();
    masterNode.connect(ctx.destination);
    const burpSnd = new SoundData(createEmptyAudioBuffer(ctx));
    ctx.decodeAudioData(burp_default.buffer.slice(0)).then((buf) => {
      burpSnd.buf = buf;
    }).catch((err) => {
      console.error("Failed to load burp: ", err);
    });
    return {
      ctx,
      masterNode,
      burpSnd
    };
  })();
  return audio2;
};

// src/audio/playMusic.ts
function playMusic(url, opt = {}) {
  const onEndEvents = new KEvent();
  const el = new Audio(url);
  const src = audio.ctx.createMediaElementSource(el);
  src.connect(audio.masterNode);
  function resumeAudioCtx() {
    if (debug.paused) return;
    if (app.isHidden() && !globalOpt.backgroundAudio) return;
    audio.ctx.resume();
  }
  function play2() {
    resumeAudioCtx();
    el.play();
  }
  if (!opt.paused) {
    play2();
  }
  el.onended = () => onEndEvents.trigger();
  return {
    play() {
      play2();
    },
    seek(time) {
      el.currentTime = time;
    },
    stop() {
      el.pause();
      this.seek(0);
    },
    set loop(l) {
      el.loop = l;
    },
    get loop() {
      return el.loop;
    },
    set paused(p) {
      if (p) {
        el.pause();
      } else {
        play2();
      }
    },
    get paused() {
      return el.paused;
    },
    time() {
      return el.currentTime;
    },
    duration() {
      return el.duration;
    },
    set volume(val) {
      el.volume = clamp(val, 0, 1);
    },
    get volume() {
      return el.volume;
    },
    set speed(s) {
      el.playbackRate = Math.max(s, 0);
    },
    get speed() {
      return el.playbackRate;
    },
    set detune(d) {
    },
    get detune() {
      return 0;
    },
    onEnd(action) {
      return onEndEvents.add(action);
    },
    then(action) {
      return this.onEnd(action);
    }
  };
}

// src/audio/play.ts
function play(src, opt = {}) {
  if (typeof src === "string" && assets.music[src]) {
    return playMusic(assets.music[src], opt);
  }
  const ctx = audio.ctx;
  let paused = opt.paused ?? false;
  let srcNode = ctx.createBufferSource();
  const onEndEvents = new KEvent();
  const gainNode = ctx.createGain();
  const panNode = ctx.createStereoPanner();
  const pos2 = opt.seek ?? 0;
  let startTime = 0;
  let stopTime = 0;
  let started = false;
  srcNode.loop = Boolean(opt.loop);
  srcNode.detune.value = opt.detune ?? 0;
  srcNode.playbackRate.value = opt.speed ?? 1;
  srcNode.connect(panNode);
  srcNode.onended = () => {
    if (getTime() >= (srcNode.buffer?.duration ?? Number.POSITIVE_INFINITY)) {
      onEndEvents.trigger();
    }
  };
  panNode.pan.value = opt.pan ?? 0;
  panNode.connect(gainNode);
  gainNode.connect(audio.masterNode);
  gainNode.gain.value = opt.volume ?? 1;
  const start = (data) => {
    srcNode.buffer = data.buf;
    if (!paused) {
      startTime = ctx.currentTime;
      srcNode.start(0, pos2);
      started = true;
    }
  };
  const snd = resolveSound(src);
  if (snd instanceof Asset) {
    snd.onLoad(start);
  }
  const getTime = () => {
    if (!srcNode.buffer) return 0;
    const t = paused ? stopTime - startTime : ctx.currentTime - startTime;
    const d = srcNode.buffer.duration;
    return srcNode.loop ? t % d : Math.min(t, d);
  };
  const cloneNode = (oldNode) => {
    const newNode = ctx.createBufferSource();
    newNode.buffer = oldNode.buffer;
    newNode.loop = oldNode.loop;
    newNode.playbackRate.value = oldNode.playbackRate.value;
    newNode.detune.value = oldNode.detune.value;
    newNode.onended = oldNode.onended;
    newNode.connect(panNode);
    return newNode;
  };
  return {
    stop() {
      this.paused = true;
      this.seek(0);
    },
    set paused(p) {
      if (paused === p) return;
      paused = p;
      if (p) {
        if (started) {
          srcNode.stop();
          started = false;
        }
        stopTime = ctx.currentTime;
      } else {
        srcNode = cloneNode(srcNode);
        const pos3 = stopTime - startTime;
        srcNode.start(0, pos3);
        started = true;
        startTime = ctx.currentTime - pos3;
        stopTime = 0;
      }
    },
    get paused() {
      return paused;
    },
    play(time = 0) {
      this.seek(time);
      this.paused = false;
    },
    seek(time) {
      if (!srcNode.buffer?.duration) return;
      if (time > srcNode.buffer.duration) return;
      if (paused) {
        srcNode = cloneNode(srcNode);
        startTime = stopTime - time;
      } else {
        srcNode.stop();
        srcNode = cloneNode(srcNode);
        startTime = ctx.currentTime - time;
        srcNode.start(0, time);
        started = true;
        stopTime = 0;
      }
    },
    // TODO: affect time()
    set speed(val) {
      srcNode.playbackRate.value = val;
    },
    get speed() {
      return srcNode.playbackRate.value;
    },
    set detune(val) {
      srcNode.detune.value = val;
    },
    get detune() {
      return srcNode.detune.value;
    },
    set volume(val) {
      gainNode.gain.value = Math.max(val, 0);
    },
    get volume() {
      return gainNode.gain.value;
    },
    set pan(pan) {
      panNode.pan.value = pan;
    },
    get pan() {
      return panNode.pan.value;
    },
    set loop(l) {
      srcNode.loop = l;
    },
    get loop() {
      return srcNode.loop;
    },
    duration() {
      return srcNode.buffer?.duration ?? 0;
    },
    time() {
      return getTime() % this.duration();
    },
    onEnd(action) {
      return onEndEvents.add(action);
    },
    then(action) {
      return this.onEnd(action);
    }
  };
}

// src/audio/burp.ts
function burp(opt) {
  return play(audio.burpSnd, opt);
}

// src/audio/volume.ts
function volume(v) {
  if (v !== void 0) {
    audio.masterNode.gain.value = v;
  }
  return audio.masterNode.gain.value;
}

// src/game/initEvents.ts
function initEvents() {
  app.onHide(() => {
    if (!globalOpt.backgroundAudio) {
      audio.ctx.suspend();
    }
  });
  app.onShow(() => {
    if (!globalOpt.backgroundAudio && !debug.paused) {
      audio.ctx.resume();
    }
  });
  app.onResize(() => {
    if (app.isFullscreen()) return;
    const fixedSize = globalOpt.width && globalOpt.height;
    if (fixedSize && !globalOpt.stretch && !globalOpt.letterbox) return;
    canvas.width = canvas.offsetWidth * pixelDensity;
    canvas.height = canvas.offsetHeight * pixelDensity;
    updateViewport();
    if (!fixedSize) {
      gfx.frameBuffer.free();
      gfx.frameBuffer = new FrameBuffer(
        gfx.ggl,
        gfx.ggl.gl.drawingBufferWidth,
        gfx.ggl.gl.drawingBufferHeight
      );
      gfx.width = gfx.ggl.gl.drawingBufferWidth / pixelDensity / gscale;
      gfx.height = gfx.ggl.gl.drawingBufferHeight / pixelDensity / gscale;
    }
  });
  if (globalOpt.debug !== false) {
    app.onKeyPress(
      globalOpt.debugKey ?? "f1",
      () => debug.inspect = !debug.inspect
    );
    app.onKeyPress("f2", () => debug.clearLog());
    app.onKeyPress("f8", () => debug.paused = !debug.paused);
    app.onKeyPress("f7", () => {
      debug.timeScale = toFixed(
        clamp(debug.timeScale - 0.2, 0, 2),
        1
      );
    });
    app.onKeyPress("f9", () => {
      debug.timeScale = toFixed(
        clamp(debug.timeScale + 0.2, 0, 2),
        1
      );
    });
    app.onKeyPress("f10", () => debug.stepFrame());
  }
  if (globalOpt.burp) {
    app.onKeyPress("b", () => burp());
  }
}

// src/game/kaboom.ts
function addKaboom(p, opt = {}) {
  const kaboom = game.root.add([
    pos(p),
    stay()
  ]);
  const speed = (opt.speed || 1) * 5;
  const s = opt.scale || 1;
  kaboom.add([
    sprite(boomSprite),
    scale(0),
    anchor("center"),
    boom(speed, s),
    ...opt.comps ?? []
  ]);
  const ka = kaboom.add([
    sprite(kaSprite),
    scale(0),
    anchor("center"),
    timer(),
    ...opt.comps ?? []
  ]);
  ka.wait(0.4 / speed, () => ka.use(boom(speed, s)));
  ka.onDestroy(() => kaboom.destroy());
  return kaboom;
}

// src/game/layers.ts
var layers = function(layerNames, defaultLayer) {
  if (game.layers) {
    throw Error("Layers can only be assigned once.");
  }
  const defaultLayerIndex = layerNames.indexOf(defaultLayer);
  if (defaultLayerIndex == -1) {
    throw Error(
      "The default layer name should be present in the layers list."
    );
  }
  game.layers = layerNames;
  game.defaultLayerIndex = defaultLayerIndex;
};

// src/game/object.ts
function destroy(obj) {
  obj.destroy();
}
function getTreeRoot() {
  return game.root;
}

// src/game/scenes.ts
function scene(id, def) {
  game.scenes[id] = def;
}
function go(name, ...args) {
  if (!game.scenes[name]) {
    throw new Error(`Scene not found: ${name}`);
  }
  game.events.onOnce("frameEnd", () => {
    game.events.trigger("sceneLeave", name);
    app.events.clear();
    game.events.clear();
    game.objEvents.clear();
    [...game.root.children].forEach((obj) => {
      if (!obj.stay || obj.scenesToStay && !obj.scenesToStay.includes(name)) {
        game.root.remove(obj);
      }
    });
    game.root.clearEvents();
    initEvents();
    game.cam = {
      pos: null,
      scale: vec2(1),
      angle: 0,
      shake: 0,
      transform: new Mat4()
    };
    game.scenes[name](...args);
  });
  game.currentScene = name;
}
function onSceneLeave(action) {
  return game.events.on("sceneLeave", action);
}
function getSceneName() {
  return game.currentScene;
}

// src/components/draw/sprite.ts
function sprite(src, opt = {}) {
  let spriteData = null;
  let curAnim = null;
  let curAnimDir = null;
  const spriteLoadedEvent = new KEvent();
  if (!src) {
    throw new Error(
      "Please pass the resource name or data to sprite()"
    );
  }
  const calcTexScale = (tex, q, w, h) => {
    const scale2 = vec2(1, 1);
    if (w && h) {
      scale2.x = w / (tex.width * q.w);
      scale2.y = h / (tex.height * q.h);
    } else if (w) {
      scale2.x = w / (tex.width * q.w);
      scale2.y = scale2.x;
    } else if (h) {
      scale2.y = h / (tex.height * q.h);
      scale2.x = scale2.y;
    }
    return scale2;
  };
  const setSpriteData = (obj, spr) => {
    if (!spr) return;
    let q = spr.frames[0].clone();
    if (opt.quad) {
      q = q.scale(opt.quad);
    }
    const scale2 = calcTexScale(
      spr.tex,
      q,
      opt.width,
      opt.height
    );
    obj.width = spr.tex.width * q.w * scale2.x;
    obj.height = spr.tex.height * q.h * scale2.y;
    if (opt.anim) {
      obj.play(opt.anim);
    }
    spriteData = spr;
    spriteLoadedEvent.trigger(spriteData);
  };
  return {
    id: "sprite",
    // TODO: allow update
    width: 0,
    height: 0,
    frame: opt.frame || 0,
    quad: opt.quad || new Quad(0, 0, 1, 1),
    animSpeed: opt.animSpeed ?? 1,
    flipX: opt.flipX ?? false,
    flipY: opt.flipY ?? false,
    get sprite() {
      return src.toString();
    },
    set sprite(src2) {
      const spr = resolveSprite(src2);
      if (spr) {
        spr.onLoad(
          (spr2) => setSpriteData(this, spr2)
        );
      }
    },
    draw() {
      if (!spriteData) return;
      const q = spriteData.frames[this.frame ?? 0];
      if (!q) {
        throw new Error(`Frame not found: ${this.frame ?? 0}`);
      }
      if (spriteData.slice9) {
        const { left, right, top, bottom } = spriteData.slice9;
        const tw = spriteData.tex.width * q.w;
        const th = spriteData.tex.height * q.h;
        const iw = this.width - left - right;
        const ih = this.height - top - bottom;
        const w1 = left / tw;
        const w3 = right / tw;
        const w2 = 1 - w1 - w3;
        const h1 = top / th;
        const h3 = bottom / th;
        const h2 = 1 - h1 - h3;
        const quads = [
          // uv
          quad(0, 0, w1, h1),
          quad(w1, 0, w2, h1),
          quad(w1 + w2, 0, w3, h1),
          quad(0, h1, w1, h2),
          quad(w1, h1, w2, h2),
          quad(w1 + w2, h1, w3, h2),
          quad(0, h1 + h2, w1, h3),
          quad(w1, h1 + h2, w2, h3),
          quad(w1 + w2, h1 + h2, w3, h3),
          // transform
          quad(0, 0, left, top),
          quad(left, 0, iw, top),
          quad(left + iw, 0, right, top),
          quad(0, top, left, ih),
          quad(left, top, iw, ih),
          quad(left + iw, top, right, ih),
          quad(0, top + ih, left, bottom),
          quad(left, top + ih, iw, bottom),
          quad(left + iw, top + ih, right, bottom)
        ];
        for (let i = 0; i < 9; i++) {
          const uv = quads[i];
          const transform = quads[i + 9];
          drawTexture(
            Object.assign(getRenderProps(this), {
              pos: transform.pos(),
              tex: spriteData.tex,
              quad: q.scale(uv),
              flipX: this.flipX,
              flipY: this.flipY,
              tiled: opt.tiled,
              width: transform.w,
              height: transform.h
            })
          );
        }
      } else {
        drawTexture(
          Object.assign(getRenderProps(this), {
            tex: spriteData.tex,
            quad: q.scale(this.quad ?? new Quad(0, 0, 1, 1)),
            flipX: this.flipX,
            flipY: this.flipY,
            tiled: opt.tiled,
            width: this.width,
            height: this.height
          })
        );
      }
    },
    add() {
      const spr = resolveSprite(src);
      if (spr) {
        spr.onLoad((spr2) => setSpriteData(this, spr2));
      } else {
        onLoad(() => setSpriteData(this, resolveSprite(src).data));
      }
    },
    update() {
      if (!spriteData || !curAnim || curAnimDir === null) {
        return;
      }
      const anim = spriteData.anims[curAnim.name];
      if (typeof anim === "number") {
        this.frame = anim;
        return;
      }
      if (anim.speed === 0) {
        throw new Error("Sprite anim speed cannot be 0");
      }
      curAnim.timer += dt() * this.animSpeed;
      if (curAnim.timer >= 1 / curAnim.speed) {
        curAnim.timer = 0;
        this.frame += curAnimDir;
        if (this.frame < Math.min(anim.from, anim.to) || this.frame > Math.max(anim.from, anim.to)) {
          if (curAnim.loop) {
            if (curAnim.pingpong) {
              this.frame -= curAnimDir;
              curAnimDir *= -1;
              this.frame += curAnimDir;
            } else {
              this.frame = anim.from;
            }
          } else {
            if (curAnim.pingpong) {
              const isForward = curAnimDir === Math.sign(anim.to - anim.from);
              if (isForward) {
                this.frame = anim.to;
                curAnimDir *= -1;
                this.frame += curAnimDir;
              } else {
                this.frame = anim.from;
                curAnim.onEnd();
                this.stop();
              }
            } else {
              this.frame = anim.to;
              curAnim.onEnd();
              this.stop();
            }
          }
        }
      }
    },
    play(name, opt2 = {}) {
      if (!spriteData) {
        spriteLoadedEvent.add(() => this.play(name, opt2));
        return;
      }
      const anim = spriteData.anims[name];
      if (anim === void 0) {
        throw new Error(`Anim not found: ${name}`);
      }
      if (curAnim) {
        this.stop();
      }
      curAnim = typeof anim === "number" ? {
        name,
        timer: 0,
        loop: false,
        pingpong: false,
        speed: 0,
        onEnd: () => {
        }
      } : {
        name,
        timer: 0,
        loop: opt2.loop ?? anim.loop ?? false,
        pingpong: opt2.pingpong ?? anim.pingpong ?? false,
        speed: opt2.speed ?? anim.speed ?? 10,
        onEnd: opt2.onEnd ?? (() => {
        })
      };
      curAnimDir = typeof anim === "number" ? null : anim.from < anim.to ? 1 : -1;
      this.frame = typeof anim === "number" ? anim : anim.from;
      this.trigger("animStart", name);
    },
    stop() {
      if (!curAnim) {
        return;
      }
      const prevAnim = curAnim.name;
      curAnim = null;
      this.trigger("animEnd", prevAnim);
    },
    numFrames() {
      return spriteData?.frames.length ?? 0;
    },
    getCurAnim() {
      return curAnim;
    },
    curAnim() {
      return curAnim?.name;
    },
    getAnim(name) {
      return spriteData?.anims[name] ?? null;
    },
    hasAnim(name) {
      return Boolean(this.getAnim(name));
    },
    onAnimEnd(action) {
      return this.on("animEnd", action);
    },
    onAnimStart(action) {
      return this.on("animStart", action);
    },
    renderArea() {
      return new Rect(vec2(0), this.width, this.height);
    },
    inspect() {
      if (typeof src === "string") {
        return `sprite: "${src}"`;
      }
      return null;
    }
  };
}

// src/components/draw/text.ts
function text(t, opt = {}) {
  function update(obj2) {
    const ftext = formatText(Object.assign(getRenderProps(obj2), {
      text: obj2.text + "",
      size: obj2.textSize,
      font: obj2.font,
      width: opt.width && obj2.width,
      align: obj2.align,
      letterSpacing: obj2.letterSpacing,
      lineSpacing: obj2.lineSpacing,
      // TODO: shouldn't run when object / ancestor is paused
      transform: obj2.textTransform,
      styles: obj2.textStyles
    }));
    if (!opt.width) {
      obj2.width = ftext.width / (obj2.scale?.x || 1);
    }
    obj2.height = ftext.height / (obj2.scale?.y || 1);
    return ftext;
  }
  const obj = {
    id: "text",
    set text(nt) {
      t = nt;
      update(this);
      this.renderedText = compileStyledText(t).text;
    },
    get text() {
      return t;
    },
    textSize: opt.size ?? DEF_TEXT_SIZE,
    font: opt.font,
    width: opt.width ?? 0,
    height: 0,
    align: opt.align,
    lineSpacing: opt.lineSpacing,
    letterSpacing: opt.letterSpacing,
    textTransform: opt.transform,
    textStyles: opt.styles,
    renderedText: t ? compileStyledText(t).text : "",
    add() {
      onLoad(() => update(this));
    },
    draw() {
      drawFormattedText(update(this));
    },
    renderArea() {
      return new Rect(vec2(0), this.width, this.height);
    }
  };
  update(obj);
  return obj;
}

// src/components/draw/uvquad.ts
function uvquad(w, h) {
  return {
    id: "rect",
    width: w,
    height: h,
    draw() {
      drawUVQuad(Object.assign(getRenderProps(this), {
        width: this.width,
        height: this.height
      }));
    },
    renderArea() {
      return new Rect(vec2(0), this.width, this.height);
    },
    inspect() {
      return `uvquad: (${Math.ceil(this.width)}w, ${Math.ceil(this.height)})h`;
    }
  };
}

// src/components/level/agent.ts
function agent(opts = {}) {
  let target = null;
  let path = null;
  let index = null;
  let navMapChangedEvent = null;
  return {
    id: "agent",
    require: ["pos", "tile"],
    agentSpeed: opts.speed ?? 100,
    allowDiagonals: opts.allowDiagonals ?? true,
    getDistanceToTarget() {
      return target ? this.pos.dist(target) : 0;
    },
    getNextLocation() {
      return path && index ? path[index] : null;
    },
    getPath() {
      return path ? path.slice() : null;
    },
    getTarget() {
      return target;
    },
    isNavigationFinished() {
      return path ? index === null : true;
    },
    isTargetReachable() {
      return path !== null;
    },
    isTargetReached() {
      return target ? this.pos.eq(target) : true;
    },
    setTarget(p) {
      target = p;
      path = this.getLevel().getPath(this.pos, target, {
        allowDiagonals: this.allowDiagonals
      });
      index = path ? 0 : null;
      if (path && index !== null) {
        if (!navMapChangedEvent) {
          navMapChangedEvent = this.getLevel().onNavigationMapChanged(() => {
            if (target && path && index !== null) {
              path = this.getLevel().getPath(
                this.pos,
                target,
                {
                  allowDiagonals: this.allowDiagonals
                }
              );
              if (path) {
                index = 0;
                this.trigger(
                  "navigationNext",
                  this,
                  path[index]
                );
              } else {
                index = null;
                this.trigger("navigationEnded", this);
              }
            }
          });
          this.onDestroy(() => navMapChangedEvent?.cancel());
        }
        this.trigger("navigationStarted", this);
        this.trigger("navigationNext", this, path[index]);
      } else {
        this.trigger("navigationEnded", this);
      }
    },
    update() {
      if (target && path && index !== null) {
        if (this.pos.sdist(path[index]) < 2) {
          if (index === path.length - 1) {
            this.pos = target.clone();
            index = null;
            this.trigger("navigationEnded", this);
            this.trigger("targetReached", this);
            return;
          } else {
            index++;
            this.trigger("navigationNext", this, path[index]);
          }
        }
        this.moveTo(path[index], this.agentSpeed);
      }
    },
    onNavigationStarted(cb) {
      return this.on("navigationStarted", cb);
    },
    onNavigationNext(cb) {
      return this.on("navigationNext", cb);
    },
    onNavigationEnded(cb) {
      return this.on("navigationEnded", cb);
    },
    onTargetReached(cb) {
      return this.on("targetReached", cb);
    },
    inspect() {
      return `agent: ` + JSON.stringify({
        target: JSON.stringify(target),
        path: JSON.stringify(path)
      });
    }
  };
}

// src/components/level/navigation.ts
function navigation(opts) {
  let graph = opts.graph;
  return {
    id: "navigator",
    require: ["pos"],
    navigateTo(target) {
      const graph2 = this.graph;
      return graph2?.getWaypointPath(this.pos, target, opts.navigationOpt);
    },
    get graph() {
      if (graph) {
        return graph;
      }
      let parent = this.parent;
      while (parent) {
        if (parent.is("navigatormap")) {
          return parent.graph;
        }
        parent = parent.parent;
      }
      return void 0;
    },
    set graph(value) {
      graph = value;
    }
  };
}

// src/components/level/patrol.ts
function patrol(opts = {}) {
  let waypoints = opts.waypoints;
  let speed = opts.speed || 100;
  let endBehavior = opts.endBehavior || "stop";
  let index = 0;
  let finished = waypoints != null;
  return {
    id: "patrol",
    require: ["pos"],
    get patrolSpeed() {
      return speed;
    },
    set patrolSpeed(value) {
      speed = value;
    },
    get waypoints() {
      return waypoints;
    },
    set waypoints(value) {
      waypoints = value;
      index = 0;
      finished = false;
    },
    get nextLocation() {
      return waypoints ? waypoints[index] : void 0;
    },
    update() {
      const nextWaypoint = this.nextLocation;
      if (!waypoints || !nextWaypoint || finished) return;
      this.moveTo(nextWaypoint, speed);
      if (this.pos.sdist(nextWaypoint) < 9) {
        switch (endBehavior) {
          case "loop":
            index = (index + 1) % waypoints.length;
            break;
          case "ping-pong":
            index = index + 1;
            if (index == waypoints.length) {
              waypoints.reverse();
              index = 0;
            }
            break;
          case "stop":
            index = Math.min(index + 1, waypoints.length - 1);
            if (index == waypoints.length - 1) {
              finished = true;
              this.trigger("patrolFinished");
            }
            break;
        }
      }
    },
    onPatrolFinished(cb) {
      return this.on(
        "patrolFinished",
        cb
      );
    }
  };
}

// src/components/level/sentry.ts
function sentry(candidates, opts = {}) {
  const get = typeof candidates === "function" ? candidates : () => {
    return game.root.query(candidates);
  };
  const checkFrequency = opts.checkFrequency || 1;
  const directionVector = typeof opts.direction === "number" ? Vec2.fromAngle(opts.direction) : opts.direction;
  let t = 0;
  return {
    id: "sentry",
    require: ["pos"],
    direction: typeof opts.direction == "number" ? Vec2.fromAngle(opts.direction) : opts.direction,
    spotted: [],
    set directionAngle(value) {
      this.direction = value !== void 0 ? Vec2.fromAngle(value) : void 0;
    },
    get directionAngle() {
      return this.direction ? this.direction.angle() : void 0;
    },
    fieldOfView: opts.fieldOfView || 200,
    // 200 degrees = Human field of view
    isWithinFieldOfView(obj, direction, fieldOfView) {
      const dir = (typeof direction === "number" ? Vec2.fromAngle(direction) : direction) || directionVector;
      const fov = fieldOfView || opts.fieldOfView;
      if (!dir || !fov || fov >= 360) return true;
      const halfAngle = fov / 2;
      return obj.pos && dir.angleBetween(obj.pos.sub(this.pos)) <= halfAngle;
    },
    hasLineOfSight(obj) {
      const hit = raycast(
        this.pos,
        obj.pos.sub(this.pos),
        opts.raycastExclude
      );
      return hit != null && hit.object === obj;
    },
    update() {
      t += dt();
      if (t > checkFrequency) {
        t -= checkFrequency;
        let objects = get();
        if (objects.length && directionVector && this.fieldOfView && this.fieldOfView < 360) {
          const halfAngle = this.fieldOfView / 2;
          objects = objects.filter(
            (o) => o.pos && directionVector.angleBetween(o.pos.sub(this.pos)) <= halfAngle
          );
        }
        if (objects.length && opts.lineOfSight) {
          objects = objects.filter((o) => {
            return o.pos && this.hasLineOfSight(o);
          });
        }
        if (objects.length > 0) {
          this.spotted = objects;
          this.trigger("objectSpotted", objects);
        }
      }
    },
    onObjectsSpotted(cb) {
      return this.on(
        "objectSpotted",
        cb
      );
    }
  };
}

// src/components/level/tile.ts
function tile(opts = {}) {
  let tilePos = vec2(0);
  let isObstacle = opts.isObstacle ?? false;
  let cost = opts.cost ?? 0;
  let edges = opts.edges ?? [];
  const getEdgeMask = () => {
    const loopup = {
      "left": 1 /* Left */,
      "top": 2 /* Top */,
      "right": 4 /* Right */,
      "bottom": 8 /* Bottom */
    };
    return edges.map((s) => loopup[s] || 0).reduce(
      (mask2, dir) => mask2 | dir,
      0
    );
  };
  let edgeMask = getEdgeMask();
  return {
    id: "tile",
    tilePosOffset: opts.offset ?? vec2(0),
    set tilePos(p) {
      const level = this.getLevel();
      tilePos = p.clone();
      this.pos = vec2(
        this.tilePos.x * level.tileWidth(),
        this.tilePos.y * level.tileHeight()
      ).add(this.tilePosOffset);
    },
    get tilePos() {
      return tilePos;
    },
    set isObstacle(is) {
      if (isObstacle === is) return;
      isObstacle = is;
      this.getLevel().invalidateNavigationMap();
    },
    get isObstacle() {
      return isObstacle;
    },
    set cost(n) {
      if (cost === n) return;
      cost = n;
      this.getLevel().invalidateNavigationMap();
    },
    get cost() {
      return cost;
    },
    set edges(e) {
      edges = e;
      edgeMask = getEdgeMask();
      this.getLevel().invalidateNavigationMap();
    },
    get edges() {
      return edges;
    },
    get edgeMask() {
      return edgeMask;
    },
    getLevel() {
      return this.parent;
    },
    moveLeft() {
      this.tilePos = this.tilePos.add(vec2(-1, 0));
    },
    moveRight() {
      this.tilePos = this.tilePos.add(vec2(1, 0));
    },
    moveUp() {
      this.tilePos = this.tilePos.add(vec2(0, -1));
    },
    moveDown() {
      this.tilePos = this.tilePos.add(vec2(0, 1));
    }
  };
}

// src/components/misc/animate.ts
var AnimateChannel = class {
  name;
  duration;
  loops;
  direction;
  easing;
  interpolation;
  isFinished;
  timing;
  easings;
  relative;
  constructor(name, opts, relative) {
    this.name = name;
    this.duration = opts.duration;
    this.loops = opts.loops || 0;
    this.direction = opts.direction || "forward";
    this.easing = opts.easing || easings_default.linear;
    this.interpolation = opts.interpolation || "linear";
    this.isFinished = false;
    this.timing = opts.timing;
    this.easings = opts.easings;
    this.relative = relative;
  }
  update(obj, t) {
    return true;
  }
  /**
   * Returns the first key index for the given time, as well as the relative time towards the second key.
   * @param t The time in seconds.
   * @param timing The optional timestamps in percent.
   * @returns The first key index for the given time, as well as the relative time towards the second key.
   */
  getLowerKeyIndexAndRelativeTime(t, count, timing) {
    const maxIndex = count - 1;
    let p = t / this.duration;
    if (this.loops !== 0 && p >= this.loops) {
      return [maxIndex, 0];
    }
    const m = Math.trunc(p);
    p -= m;
    if (this.direction == "reverse" || this.direction == "ping-pong" && m & 1) {
      p = 1 - p;
    }
    if (timing) {
      let index = 0;
      while (timing[index + 1] !== void 0 && timing[index + 1] < p) {
        index++;
      }
      if (index >= maxIndex) {
        return [maxIndex, 0];
      }
      return [
        index,
        (p - timing[index]) / (timing[index + 1] - timing[index])
      ];
    } else {
      const index = Math.floor((count - 1) * p);
      return [index, (p - index / maxIndex) * maxIndex];
    }
  }
  setValue(obj, name, value) {
    if (this.relative) {
      switch (name) {
        case "pos":
          obj["pos"] = obj.base.pos.add(value);
          break;
        case "angle":
          obj["angle"] = obj.base.angle + value;
          break;
        case "scale":
          obj["scale"] = obj.base.scale.scale(value);
          break;
        case "opacity":
          obj["opacity"] = obj.base.opacity * value;
          break;
        default:
          obj[name] = value;
      }
    } else {
      obj[name] = value;
    }
  }
  serialize() {
    const serialization = {
      duration: this.duration,
      keys: []
    };
    if (this.loops) {
      serialization.loops = this.loops;
    }
    if (this.direction !== "forward") {
      serialization.direction = this.direction;
    }
    if (this.easing != easings_default.linear) {
      serialization.easing = this.easing.name;
    }
    if (this.interpolation !== "linear") {
      serialization.interpolation = this.interpolation;
    }
    if (this.timing) {
      serialization.timing = this.timing;
    }
    if (this.easings) {
      serialization.easings = this.easings.map((e) => this.easing.name);
    }
    return serialization;
  }
};
function reflect(a, b) {
  return b.add(b.sub(a));
}
var AnimateChannelNumber = class extends AnimateChannel {
  keys;
  constructor(name, keys, opts, relative) {
    super(name, opts, relative);
    this.keys = keys;
  }
  update(obj, t) {
    const [index, alpha] = this.getLowerKeyIndexAndRelativeTime(
      t,
      this.keys.length,
      this.timing
    );
    if (alpha == 0 || this.interpolation === "none") {
      this.setValue(obj, this.name, this.keys[index]);
    } else {
      const easing = this.easings ? this.easings[index] : this.easing;
      this.setValue(
        obj,
        this.name,
        lerp(
          this.keys[index],
          this.keys[index + 1],
          easing(alpha)
        )
      );
    }
    return alpha == 1;
  }
  serialize() {
    return Object.assign(super.serialize(), { keys: this.keys });
  }
};
var AnimateChannelVec2 = class extends AnimateChannel {
  keys;
  curves;
  dcurves;
  constructor(name, keys, opts, relative, followMotion) {
    super(name, opts, relative);
    this.keys = keys;
    if (this.interpolation === "spline") {
      this.curves = [];
      if (followMotion) {
        this.dcurves = [];
      }
      for (let i = 0; i < this.keys.length - 1; i++) {
        const prevKey = this.keys[i];
        const nextIndex = i + 1;
        const nextKey = this.keys[nextIndex];
        const prevPrevKey = i > 0 ? this.keys[i - 1] : reflect(nextKey, prevKey);
        const nextNextKey = nextIndex < this.keys.length - 1 ? this.keys[nextIndex + 1] : reflect(prevKey, nextKey);
        this.curves.push(
          catmullRom(prevPrevKey, prevKey, nextKey, nextNextKey)
        );
        if (followMotion) {
          this.dcurves?.push(
            catmullRom(
              prevPrevKey,
              prevKey,
              nextKey,
              nextNextKey,
              hermiteFirstDerivative
            )
          );
        }
      }
    }
  }
  update(obj, t) {
    const [index, alpha] = this.getLowerKeyIndexAndRelativeTime(
      t,
      this.keys.length,
      this.timing
    );
    if (alpha == 0 || this.interpolation === "none") {
      this.setValue(obj, this.name, this.keys[index]);
    } else {
      const easing = this.easings ? this.easings[index] : this.easing;
      switch (this.interpolation) {
        case "linear":
          this.setValue(
            obj,
            this.name,
            this.keys[index].lerp(
              this.keys[index + 1],
              easing(alpha)
            )
          );
          break;
        case "slerp":
          this.setValue(
            obj,
            this.name,
            this.keys[index].slerp(
              this.keys[index + 1],
              easing(alpha)
            )
          );
          break;
        case "spline":
          if (this.curves) {
            this.setValue(
              obj,
              this.name,
              this.curves[index](easing(alpha))
            );
            if (this.dcurves) {
              this.setValue(
                obj,
                "angle",
                this.dcurves[index](easing(alpha)).angle()
              );
            }
            break;
          }
      }
    }
    return alpha == 1;
  }
  serialize() {
    return Object.assign(super.serialize(), {
      keys: this.keys.map((v) => [v.x, v.y])
    });
  }
};
var AnimateChannelColor = class extends AnimateChannel {
  keys;
  constructor(name, keys, opts, relative) {
    super(name, opts, relative);
    this.keys = keys;
  }
  update(obj, t) {
    const [index, alpha] = this.getLowerKeyIndexAndRelativeTime(
      t,
      this.keys.length,
      this.timing
    );
    if (alpha == 0 || this.interpolation == "none") {
      this.setValue(obj, this.name, this.keys[index]);
    } else {
      const easing = this.easings ? this.easings[index] : this.easing;
      this.setValue(
        obj,
        this.name,
        this.keys[index].lerp(
          this.keys[index + 1],
          easing(alpha)
        )
      );
    }
    return alpha == 1;
  }
  serialize() {
    return Object.assign(super.serialize(), { keys: this.keys });
  }
};
function animate(gopts = {}) {
  const channels = [];
  let t = 0;
  let isFinished = false;
  return {
    id: "animate",
    require: gopts.followMotion ? ["rotate"] : void 0,
    base: {
      pos: vec2(0, 0),
      angle: 0,
      scale: vec2(1, 1),
      opacity: 1
    },
    add() {
      if (gopts.relative) {
        if (this.is("pos")) {
          this.base.pos = this.pos.clone();
        }
        if (this.is("rotate")) {
          this.base.angle = this.angle;
        }
        if (this.is("scale")) {
          this.base.scale = this.scale;
        }
        if (this.is("opacity")) {
          this.base.opacity = this.opacity;
        }
      }
    },
    update() {
      let allFinished = true;
      let localFinished;
      t += dt();
      for (const c of channels) {
        localFinished = c.update(this, t);
        if (localFinished && !c.isFinished) {
          c.isFinished = true;
          this.trigger(
            "animateChannelFinished",
            c.name
          );
        }
        allFinished &&= localFinished;
      }
      if (allFinished && !isFinished) {
        isFinished = true;
        this.trigger("animateFinished");
      }
    },
    animate(name, keys, opts) {
      isFinished = false;
      this.unanimate(name);
      if (typeof keys[0] === "number") {
        channels.push(
          new AnimateChannelNumber(
            name,
            keys,
            opts,
            gopts.relative || false
          )
        );
      } else if (keys[0] instanceof Vec2) {
        channels.push(
          new AnimateChannelVec2(
            name,
            keys,
            opts,
            gopts.relative || false,
            name === "pos" && (gopts.followMotion || false)
          )
        );
      } else if (keys[0] instanceof Color) {
        channels.push(
          new AnimateChannelColor(
            name,
            keys,
            opts,
            gopts.relative || false
          )
        );
      }
    },
    unanimate(name) {
      const index = channels.findIndex((c) => c.name === name);
      if (index >= 0) {
        channels.splice(index, 1);
      }
    },
    unanimateAll() {
      channels.splice(0, channels.length);
    },
    onAnimateFinished(cb) {
      return this.on("animateFinished", cb);
    },
    onAnimateChannelFinished(cb) {
      return this.on(
        "animateChannelFinished",
        cb
      );
    },
    serializeAnimationChannels() {
      return channels.reduce((o, c) => {
        o[c.name] = c.serialize();
        return o;
      }, {});
    },
    serializeAnimationOptions() {
      const options = {};
      if (gopts.followMotion) {
        options.followMotion = true;
      }
      if (gopts.relative) {
        options.relative = true;
      }
      return options;
    }
  };
}
function serializeAnimation(obj, name) {
  let serialization = { name: obj.name };
  if (obj.is("animate")) {
    serialization.channels = obj.serializeAnimationChannels();
    Object.assign(
      serialization,
      obj.serializeAnimationOptions()
    );
  }
  if (obj.children.length > 0) {
    serialization.children = obj.children.filter((o) => o.is("named")).map(
      (o) => serializeAnimation(o, o.name)
    );
  }
  return serialization;
}

// src/components/misc/boom.ts
function boom(speed = 2, size = 1) {
  let time = 0;
  return {
    require: ["scale"],
    update() {
      const s = Math.sin(time * speed) * size;
      if (s < 0) {
        this.destroy();
      }
      this.scale = vec2(s);
      time += dt();
    }
  };
}

// src/components/misc/health.ts
function health(hp, maxHP) {
  if (hp == null) {
    throw new Error("health() requires the initial amount of hp");
  }
  return {
    id: "health",
    hurt(n = 1) {
      this.setHP(hp - n);
      this.trigger("hurt", n);
    },
    heal(n = 1) {
      const origHP = hp;
      this.setHP(hp + n);
      this.trigger("heal", hp - origHP);
    },
    hp() {
      return hp;
    },
    maxHP() {
      return maxHP ?? null;
    },
    setMaxHP(n) {
      maxHP = n;
    },
    setHP(n) {
      hp = maxHP ? Math.min(maxHP, n) : n;
      if (hp <= 0) {
        this.trigger("death");
      }
    },
    onHurt(action) {
      return this.on("hurt", action);
    },
    onHeal(action) {
      return this.on("heal", action);
    },
    onDeath(action) {
      return this.on("death", action);
    },
    inspect() {
      return `health: ${hp}`;
    }
  };
}

// src/components/misc/lifespan.ts
function lifespan(time, opt = {}) {
  if (time == null) {
    throw new Error("lifespan() requires time");
  }
  const fade = opt.fade ?? 0;
  return {
    id: "lifespan",
    require: ["opacity"],
    async add() {
      await game.root.wait(time);
      this.opacity = this.opacity ?? 1;
      if (fade > 0) {
        await game.root.tween(
          this.opacity,
          0,
          fade,
          (a) => this.opacity = a,
          easings_default.linear
        );
      }
      this.destroy();
    }
  };
}

// src/components/misc/named.ts
function named(name) {
  return {
    id: "named",
    name
  };
}

// src/components/misc/state.ts
function state(initState, stateList, transitions) {
  if (!initState) {
    throw new Error("state() requires an initial state");
  }
  const events = {};
  function initStateEvents(state2) {
    if (!events[state2]) {
      events[state2] = {
        enter: new KEvent(),
        end: new KEvent(),
        update: new KEvent(),
        draw: new KEvent()
      };
    }
  }
  function on2(event, state2, action) {
    initStateEvents(state2);
    return events[state2][event].add(action);
  }
  function trigger(event, state2, ...args) {
    initStateEvents(state2);
    events[state2][event].trigger(...args);
  }
  let didFirstEnter = false;
  return {
    id: "state",
    state: initState,
    enterState(state2, ...args) {
      didFirstEnter = true;
      if (stateList && !stateList.includes(state2)) {
        throw new Error(`State not found: ${state2}`);
      }
      const oldState = this.state;
      if (transitions) {
        if (!transitions?.[oldState]) {
          return;
        }
        const available = typeof transitions[oldState] === "string" ? [transitions[oldState]] : transitions[oldState];
        if (!available.includes(state2)) {
          throw new Error(
            `Cannot transition state from "${oldState}" to "${state2}". Available transitions: ${available.map((s) => `"${s}"`).join(", ")}`
          );
        }
      }
      trigger("end", oldState, ...args);
      this.state = state2;
      trigger("enter", state2, ...args);
      trigger("enter", `${oldState} -> ${state2}`, ...args);
    },
    onStateTransition(from, to, action) {
      return on2("enter", `${from} -> ${to}`, action);
    },
    onStateEnter(state2, action) {
      return on2("enter", state2, action);
    },
    onStateUpdate(state2, action) {
      return on2("update", state2, action);
    },
    onStateDraw(state2, action) {
      return on2("draw", state2, action);
    },
    onStateEnd(state2, action) {
      return on2("end", state2, action);
    },
    update() {
      if (!didFirstEnter) {
        trigger("enter", initState);
        didFirstEnter = true;
      }
      trigger("update", this.state);
    },
    draw() {
      trigger("draw", this.state);
    },
    inspect() {
      return `state: ${this.state}`;
    }
  };
}

// src/components/misc/stay.ts
function stay(scenesToStay) {
  return {
    id: "stay",
    stay: true,
    scenesToStay
  };
}

// src/components/misc/textInput.ts
function textInput(hasFocus = true, maxInputLength) {
  let charEv;
  let backEv;
  return {
    id: "textInput",
    hasFocus,
    require: ["text"],
    add() {
      charEv = k.onCharInput((character) => {
        if (this.hasFocus && (!maxInputLength || this.text.length < maxInputLength)) {
          if (k.isKeyDown("shift")) {
            this.text += character.toUpperCase();
          } else {
            this.text += character;
          }
        }
      });
      backEv = k.onKeyPressRepeat("backspace", () => {
        if (this.hasFocus) {
          this.text = this.text.slice(0, -1);
        }
      });
    },
    destroy() {
      charEv.cancel();
      backEv.cancel();
    }
  };
}

// src/components/misc/timer.ts
function timer() {
  return {
    id: "timer",
    wait(time, action) {
      const actions = [];
      if (action) actions.push(action);
      let t = 0;
      const ev = this.onUpdate(() => {
        t += k.dt();
        if (t >= time) {
          actions.forEach((f) => f());
          ev.cancel();
        }
      });
      return {
        get paused() {
          return ev.paused;
        },
        set paused(p) {
          ev.paused = p;
        },
        cancel: ev.cancel,
        onEnd(action2) {
          actions.push(action2);
        },
        then(action2) {
          this.onEnd(action2);
          return this;
        }
      };
    },
    loop(t, action) {
      let curTimer = null;
      const newAction = () => {
        curTimer = this.wait(t, newAction);
        action();
      };
      curTimer = this.wait(0, newAction);
      return {
        get paused() {
          return curTimer?.paused ?? false;
        },
        set paused(p) {
          if (curTimer) curTimer.paused = p;
        },
        cancel: () => curTimer?.cancel()
      };
    },
    tween(from, to, duration, setValue, easeFunc = easings_default.linear) {
      let curTime = 0;
      const onEndEvents = [];
      const ev = this.onUpdate(() => {
        curTime += k.dt();
        const t = Math.min(curTime / duration, 1);
        setValue(lerp(from, to, easeFunc(t)));
        if (t === 1) {
          ev.cancel();
          setValue(to);
          onEndEvents.forEach((action) => action());
        }
      });
      return {
        get paused() {
          return ev.paused;
        },
        set paused(p) {
          ev.paused = p;
        },
        onEnd(action) {
          onEndEvents.push(action);
        },
        then(action) {
          this.onEnd(action);
          return this;
        },
        cancel() {
          ev.cancel();
        },
        finish() {
          ev.cancel();
          setValue(to);
          onEndEvents.forEach((action) => action());
        }
      };
    }
  };
}

// src/components/physics/area.ts
var areaCount = 0;
function usesArea() {
  return areaCount > 0;
}
function area(opt = {}) {
  const colliding = {};
  const collidingThisFrame = /* @__PURE__ */ new Set();
  return {
    id: "area",
    collisionIgnore: opt.collisionIgnore ?? [],
    add() {
      areaCount++;
      if (this.area.cursor) {
        this.onHover(() => app.setCursor(this.area.cursor));
      }
      this.onCollideUpdate((obj, col) => {
        if (!obj.id) {
          throw new Error("area() requires the object to have an id");
        }
        if (!colliding[obj.id]) {
          this.trigger("collide", obj, col);
        }
        if (!col) {
          return;
        }
        colliding[obj.id] = col;
        collidingThisFrame.add(obj.id);
      });
    },
    destroy() {
      areaCount--;
    },
    fixedUpdate() {
      for (const id in colliding) {
        if (!collidingThisFrame.has(Number(id))) {
          this.trigger("collideEnd", colliding[id].target);
          delete colliding[id];
        }
      }
      collidingThisFrame.clear();
    },
    drawInspect() {
      const a = this.localArea();
      k.pushTransform();
      k.pushTranslate(this.area.offset);
      const opts = {
        outline: {
          width: 4 / getViewportScale(),
          color: rgb(0, 0, 255)
        },
        anchor: this.anchor,
        fill: false,
        fixed: isFixed(this)
      };
      if (a instanceof k.Rect) {
        k.drawRect({
          ...opts,
          pos: a.pos,
          width: a.width * this.area.scale.x,
          height: a.height * this.area.scale.y
        });
      } else if (a instanceof k.Polygon) {
        k.drawPolygon({
          ...opts,
          pts: a.pts,
          scale: this.area.scale
        });
      } else if (a instanceof k.Circle) {
        k.drawCircle({
          ...opts,
          pos: a.center,
          radius: a.radius
        });
      }
      k.popTransform();
    },
    area: {
      shape: opt.shape ?? null,
      scale: opt.scale ? vec2(opt.scale) : vec2(1),
      offset: opt.offset ?? vec2(0),
      cursor: opt.cursor ?? null
    },
    isClicked() {
      return app.isMousePressed() && this.isHovering();
    },
    isHovering() {
      const mpos = isFixed(this) ? k.mousePos() : k.toWorld(k.mousePos());
      return this.hasPoint(mpos);
    },
    checkCollision(other) {
      if (!other.id) {
        throw new Error(
          "checkCollision() requires the object to have an id"
        );
      }
      return colliding[other.id] ?? null;
    },
    getCollisions() {
      return Object.values(colliding);
    },
    // TODO: perform check instead of use cache
    isColliding(other) {
      if (!other.id) {
        throw new Error(
          "isColliding() requires the object to have an id"
        );
      }
      return Boolean(colliding[other.id]);
    },
    isOverlapping(other) {
      if (!other.id) {
        throw new Error(
          "isOverlapping() requires the object to have an id"
        );
      }
      const col = colliding[other.id];
      return col && col.hasOverlap();
    },
    onClick(f, btn = "left") {
      const e = app.onMousePress(btn, () => {
        if (this.isHovering()) {
          f();
        }
      });
      this.onDestroy(() => e.cancel());
      return e;
    },
    onHover(action) {
      let hovering = false;
      return this.onUpdate(() => {
        if (!hovering) {
          if (this.isHovering()) {
            hovering = true;
            action();
          }
        } else {
          hovering = this.isHovering();
        }
      });
    },
    onHoverUpdate(onHover2) {
      return this.onUpdate(() => {
        if (this.isHovering()) {
          onHover2();
        }
      });
    },
    onHoverEnd(action) {
      let hovering = false;
      return this.onUpdate(() => {
        if (hovering) {
          if (!this.isHovering()) {
            hovering = false;
            action();
          }
        } else {
          hovering = this.isHovering();
        }
      });
    },
    onCollide(tag, cb) {
      if (typeof tag === "function" && cb === void 0) {
        return this.on("collide", tag);
      } else if (typeof tag === "string") {
        return this.onCollide((obj, col) => {
          if (obj.is(tag)) {
            cb?.(obj, col);
          }
        });
      } else {
        throw new Error(
          "onCollide() requires either a function or a tag"
        );
      }
    },
    onCollideUpdate(tag, cb) {
      if (typeof tag === "function" && cb === void 0) {
        return this.on("collideUpdate", tag);
      } else if (typeof tag === "string") {
        return this.on(
          "collideUpdate",
          (obj, col) => obj.is(tag) && cb?.(obj, col)
        );
      } else {
        throw new Error(
          "onCollideUpdate() requires either a function or a tag"
        );
      }
    },
    onCollideEnd(tag, cb) {
      if (typeof tag === "function" && cb === void 0) {
        return this.on("collideEnd", tag);
      } else if (typeof tag === "string") {
        return this.on(
          "collideEnd",
          (obj) => obj.is(tag) && cb?.(obj)
        );
      } else {
        throw new Error(
          "onCollideEnd() requires either a function or a tag"
        );
      }
    },
    hasPoint(pt) {
      return testPolygonPoint(this.worldArea(), pt);
    },
    // push an obj out of another if they're overlapped
    resolveCollision(obj) {
      const col = this.checkCollision(obj);
      if (col && !col.resolved) {
        this.pos = this.pos.add(col.displacement);
        col.resolved = true;
      }
    },
    localArea() {
      return this.area.shape ? this.area.shape : this.renderArea();
    },
    // TODO: cache
    worldArea() {
      const localArea = this.localArea();
      if (!(localArea instanceof k.Polygon || localArea instanceof k.Rect)) {
        throw new Error(
          "Only support polygon and rect shapes for now"
        );
      }
      const transform = this.transform.clone().translate(this.area.offset).scale(vec2(this.area.scale ?? 1));
      if (localArea instanceof k.Rect) {
        const offset = anchorPt(this.anchor || DEF_ANCHOR).add(1, 1).scale(-0.5).scale(localArea.width, localArea.height);
        transform.translate(offset);
      }
      return localArea.transform(transform);
    },
    screenArea() {
      const area2 = this.worldArea();
      if (isFixed(this)) {
        return area2;
      } else {
        return area2.transform(game.cam.transform);
      }
    },
    inspect() {
      if (this.area.scale?.x == this.area.scale?.y) {
        return `area: ${this.area.scale?.x?.toFixed(1)}x`;
      } else {
        return `area: (${this.area.scale?.x?.toFixed(1)}x, ${this.area.scale.y?.toFixed(1)}y)`;
      }
    }
  };
}

// src/components/physics/body.ts
function body(opt = {}) {
  let curPlatform = null;
  let lastPlatformPos = null;
  let willFall = false;
  const acc = vec2(0);
  let prevPhysicsPos = null;
  let nextPhysicsPos = null;
  let prevDrawPos;
  return {
    id: "body",
    require: ["pos"],
    vel: vec2(0),
    drag: opt.drag ?? 0,
    jumpForce: opt.jumpForce ?? DEF_JUMP_FORCE,
    gravityScale: opt.gravityScale ?? 1,
    isStatic: opt.isStatic ?? false,
    // TODO: prefer density * area
    mass: opt.mass ?? 1,
    add() {
      prevPhysicsPos = this.pos.clone();
      nextPhysicsPos = this.pos.clone();
      prevDrawPos = this.pos.clone();
      if (this.mass === 0) {
        throw new Error("Can't set body mass to 0");
      }
      if (this.is("area")) {
        this.onCollideUpdate(
          (other, col) => {
            if (!col) return;
            if (!other.is("body")) return;
            if (col.resolved) return;
            this.trigger("beforePhysicsResolve", col);
            const rcol = col.reverse();
            other.trigger("beforePhysicsResolve", rcol);
            if (col.resolved || rcol.resolved) {
              return;
            }
            if (this.isStatic && other.isStatic) {
              return;
            } else if (!this.isStatic && !other.isStatic) {
              const tmass = this.mass + other.mass;
              this.pos = this.pos.add(
                col.displacement.scale(other.mass / tmass)
              );
              other.pos = other.pos.add(
                col.displacement.scale(-this.mass / tmass)
              );
              this.transform = calcTransform(this);
              other.transform = calcTransform(other);
            } else {
              const col2 = !this.isStatic && other.isStatic ? col : col.reverse();
              col2.source.pos = col2.source.pos.add(
                col2.displacement
              );
              col2.source.transform = calcTransform(
                col2.source
              );
            }
            col.resolved = true;
            this.trigger("physicsResolve", col);
            other.trigger("physicsResolve", col.reverse());
          }
        );
        this.onPhysicsResolve((col) => {
          if (game.gravity) {
            if (col.isBottom() && this.isFalling()) {
              this.vel = this.vel.reject(
                game.gravity.unit()
              );
              const pastPlatform = curPlatform;
              curPlatform = col.target;
              if (pastPlatform != curPlatform) {
                lastPlatformPos = col.target.pos;
              }
              if (willFall) {
                willFall = false;
              } else if (!pastPlatform) {
                this.trigger("ground", curPlatform);
                col.target.trigger("land", this);
              }
            } else if (col.isTop() && this.isJumping()) {
              this.vel = this.vel.reject(
                game.gravity.unit()
              );
              this.trigger("headbutt", col.target);
              col.target.trigger("headbutted", this);
            }
          }
        });
      }
    },
    update() {
      if (curPlatform) {
        if (
          // We are still colliding with the platform and the platform exists
          this.isColliding(curPlatform) && curPlatform.exists() && curPlatform.is("body")
        ) {
          if (lastPlatformPos && !curPlatform.pos.eq(lastPlatformPos) && opt.stickToPlatform !== false) {
            this.moveBy(
              curPlatform.pos.sub(lastPlatformPos)
            );
          }
          lastPlatformPos = curPlatform.pos;
        }
      }
      const dt2 = k.restDt();
      if (dt2) {
        if (this.pos.x == prevDrawPos.x) {
          this.pos.x = k.lerp(
            prevPhysicsPos.x,
            nextPhysicsPos.x,
            dt2 / k.fixedDt()
          );
          prevDrawPos.x = this.pos.x;
        }
        if (this.pos.y == prevDrawPos.y) {
          this.pos.y = k.lerp(
            prevPhysicsPos.y,
            nextPhysicsPos.y,
            dt2 / k.fixedDt()
          );
          prevDrawPos.y = this.pos.y;
        }
      }
    },
    fixedUpdate() {
      if (prevPhysicsPos) {
        if (this.pos.x == prevDrawPos.x) {
          this.pos.x = prevPhysicsPos.x;
        }
        if (this.pos.y == prevDrawPos.y) {
          this.pos.y = prevPhysicsPos.y;
        }
        prevPhysicsPos = null;
      }
      if (game.gravity && !this.isStatic) {
        if (willFall) {
          curPlatform = null;
          lastPlatformPos = null;
          this.trigger("fallOff");
          willFall = false;
        }
        if (curPlatform) {
          if (
            // If we are no longer on the platform, or the platform was deleted
            !this.isColliding(curPlatform) || !curPlatform.exists() || !curPlatform.is("body")
          ) {
            willFall = true;
          }
        }
        const prevVel = this.vel.clone();
        this.vel = this.vel.add(
          game.gravity.scale(this.gravityScale * k.dt())
        );
        const maxVel = opt.maxVelocity ?? MAX_VEL;
        if (this.vel.slen() > maxVel * maxVel) {
          this.vel = this.vel.unit().scale(maxVel);
        }
        if (prevVel.dot(game.gravity) < 0 && this.vel.dot(game.gravity) >= 0) {
          this.trigger("fall");
        }
      }
      this.vel.x += acc.x * k.dt();
      this.vel.y += acc.y * k.dt();
      this.vel.x *= 1 - this.drag * k.dt();
      this.vel.y *= 1 - this.drag * k.dt();
      this.move(this.vel);
      const dt2 = k.restDt();
      if (dt2) {
        prevPhysicsPos = this.pos.clone();
        const nextVel = this.vel.add(acc.scale(k.dt()));
        nextPhysicsPos = this.pos.add(nextVel.scale(k.dt()));
        prevDrawPos = this.pos.clone();
      }
      acc.x = 0;
      acc.y = 0;
    },
    onPhysicsResolve(action) {
      return this.on("physicsResolve", action);
    },
    onBeforePhysicsResolve(action) {
      return this.on("beforePhysicsResolve", action);
    },
    curPlatform() {
      return curPlatform;
    },
    isGrounded() {
      return curPlatform !== null;
    },
    isFalling() {
      return this.vel.dot(k.getGravityDirection()) > 0;
    },
    isJumping() {
      return this.vel.dot(k.getGravityDirection()) < 0;
    },
    applyImpulse(impulse) {
      this.vel = this.vel.add(impulse);
    },
    addForce(force) {
      acc.x += force.x / this.mass;
      acc.y += force.y / this.mass;
    },
    jump(force) {
      curPlatform = null;
      lastPlatformPos = null;
      this.vel = k.getGravityDirection().scale(
        -force || -this.jumpForce
      );
    },
    onGround(action) {
      return this.on("ground", action);
    },
    onFall(action) {
      return this.on("fall", action);
    },
    onFallOff(action) {
      return this.on("fallOff", action);
    },
    onHeadbutt(action) {
      return this.on("headbutt", action);
    },
    onLand(action) {
      return this.on("land", action);
    },
    onHeadbutted(action) {
      return this.on("headbutted", action);
    },
    inspect() {
      return `gravityScale: ${this.gravityScale}x`;
    }
  };
}

// src/components/physics/doubleJump.ts
function doubleJump(numJumps = 2) {
  let jumpsLeft = numJumps;
  return {
    id: "doubleJump",
    require: ["body"],
    numJumps,
    add() {
      this.onGround(() => {
        jumpsLeft = this.numJumps;
      });
    },
    doubleJump(force) {
      if (jumpsLeft <= 0) {
        return;
      }
      if (jumpsLeft < this.numJumps) {
        this.trigger("doubleJump");
      }
      jumpsLeft--;
      this.jump(force);
    },
    onDoubleJump(action) {
      return this.on("doubleJump", action);
    },
    inspect() {
      return `jumpsLeft: ${jumpsLeft}`;
    }
  };
}

// src/components/physics/effectors.ts
function surfaceEffector(opts) {
  return {
    id: "surfaceEffector",
    require: ["area"],
    speed: opts.speed,
    speedVariation: opts.speedVariation ?? 0,
    forceScale: opts.speedVariation ?? 0.9,
    add() {
      this.onCollideUpdate("body", (obj, col) => {
        const dir = col?.normal.normal();
        const currentVel = obj.vel.project(dir);
        const wantedVel = dir?.scale(this.speed);
        const force = wantedVel?.sub(currentVel);
        obj.addForce(force?.scale(obj.mass * this.forceScale));
      });
    }
  };
}
function areaEffector(opts) {
  return {
    id: "areaEffector",
    require: ["area"],
    useGlobalAngle: opts.useGlobalAngle || false,
    forceAngle: opts.forceAngle,
    forceMagnitude: opts.forceMagnitude,
    forceVariation: opts.forceVariation ?? 0,
    linearDrag: opts.linearDrag ?? 0,
    // angularDrag: opts.angularDrag ?? 0,
    add() {
      this.onCollideUpdate("body", (obj, col) => {
        const dir = Vec2.fromAngle(this.forceAngle);
        const force = dir.scale(this.forceMagnitude);
        obj.addForce(force);
        if (this.linearDrag) {
          obj.addForce(obj.vel.scale(-this.linearDrag));
        }
      });
    }
  };
}
function pointEffector(opts) {
  return {
    id: "pointEffector",
    require: ["area", "pos"],
    forceMagnitude: opts.forceMagnitude,
    forceVariation: opts.forceVariation ?? 0,
    distanceScale: opts.distanceScale ?? 1,
    forceMode: opts.forceMode || "inverseLinear",
    linearDrag: opts.linearDrag ?? 0,
    // angularDrag: opts.angularDrag ?? 0,
    add() {
      this.onCollideUpdate("body", (obj, col) => {
        const dir = this.pos.sub(obj.pos);
        const length = dir.len();
        const distance = length * this.distanceScale / 10;
        const forceScale = this.forceMode === "constant" ? 1 : this.forceMode === "inverseLinear" ? 1 / distance : 1 / distance ** 2;
        const force = dir.scale(
          this.forceMagnitude * forceScale / length
        );
        obj.addForce(force);
        if (this.linearDrag) {
          obj.addForce(obj.vel.scale(-this.linearDrag));
        }
      });
    }
  };
}
function constantForce(opts) {
  return {
    id: "constantForce",
    require: ["body"],
    force: opts.force,
    update() {
      if (this.force) {
        this.addForce(this.force);
      }
    }
  };
}
function buoyancyEffector(opts) {
  return {
    id: "buoyancyEffector",
    require: ["area"],
    surfaceLevel: opts.surfaceLevel,
    density: opts.density ?? 1,
    linearDrag: opts.linearDrag ?? 1,
    angularDrag: opts.angularDrag ?? 0.2,
    flowAngle: opts.flowAngle ?? 0,
    flowMagnitude: opts.flowMagnitude ?? 0,
    flowVariation: opts.flowVariation ?? 0,
    add() {
      this.onCollideUpdate("body", (obj, col) => {
        const o = obj;
        const polygon2 = o.worldArea();
        const [submergedArea, _] = polygon2.cut(
          vec2(-100, this.surfaceLevel),
          vec2(100, this.surfaceLevel)
        );
        if (submergedArea) {
          this.applyBuoyancy(o, submergedArea);
          this.applyDrag(o, submergedArea);
        }
        if (this.flowMagnitude) {
          o.addForce(
            Vec2.fromAngle(this.flowAngle).scale(
              this.flowMagnitude
            )
          );
        }
      });
    },
    applyBuoyancy(body2, submergedArea) {
      const displacedMass = this.density * submergedArea.area();
      const buoyancyForce = vec2(0, 1).scale(-displacedMass);
      body2.addForce(buoyancyForce);
    },
    applyDrag(body2, submergedArea) {
      const velocity = body2.vel;
      const dragMagnitude = this.density * this.linearDrag;
      const dragForce = velocity.scale(-dragMagnitude);
      body2.addForce(dragForce);
    }
  };
}

// src/components/transform/anchor.ts
function anchor(o) {
  if (!o) {
    throw new Error("Please define an anchor");
  }
  return {
    id: "anchor",
    anchor: o,
    inspect() {
      if (typeof this.anchor === "string") {
        return `anchor: ` + this.anchor;
      } else {
        return `anchor: ` + this.anchor.toString();
      }
    }
  };
}

// src/components/transform/fixed.ts
function fixed() {
  return {
    id: "fixed",
    fixed: true
  };
}

// src/components/transform/follow.ts
function follow(obj, offset) {
  return {
    id: "follow",
    require: ["pos"],
    follow: {
      obj,
      offset: offset ?? vec2(0)
    },
    add() {
      if (obj.exists()) {
        this.pos = this.follow.obj.pos.add(this.follow.offset);
      }
    },
    update() {
      if (obj.exists()) {
        this.pos = this.follow.obj.pos.add(this.follow.offset);
      }
    }
  };
}

// src/components/transform/layer.ts
function layer(layer2) {
  let _layerIndex = game.layers?.indexOf(layer2);
  return {
    id: "layer",
    get layerIndex() {
      return _layerIndex ?? null;
    },
    get layer() {
      if (!_layerIndex) return null;
      return game.layers?.[_layerIndex] ?? null;
    },
    set layer(value) {
      _layerIndex = game.layers?.indexOf(value);
      if (_layerIndex == -1) throw Error("Invalid layer name");
    },
    inspect() {
      return `layer: ${this.layer}`;
    }
  };
}

// src/components/transform/move.ts
function move(dir, speed) {
  const d = typeof dir === "number" ? Vec2.fromAngle(dir) : dir.unit();
  return {
    id: "move",
    require: ["pos"],
    update() {
      this.move(d.scale(speed));
    }
  };
}

// src/components/transform/offscreen.ts
function offscreen(opt = {}) {
  const distance = opt.distance ?? DEF_OFFSCREEN_DIS;
  let isOut = false;
  return {
    id: "offscreen",
    require: ["pos"],
    isOffScreen() {
      const pos2 = this.screenPos();
      if (!pos2) return false;
      const screenRect = new Rect(vec2(0), k.width(), k.height());
      return !k.testRectPoint(screenRect, pos2) && screenRect.sdistToPoint(pos2) > distance * distance;
    },
    onExitScreen(action) {
      return this.on("exitView", action);
    },
    onEnterScreen(action) {
      return this.on("enterView", action);
    },
    update() {
      if (this.isOffScreen()) {
        if (!isOut) {
          this.trigger("exitView");
          isOut = true;
        }
        if (opt.hide) this.hidden = true;
        if (opt.pause) this.paused = true;
        if (opt.destroy) this.destroy();
      } else {
        if (isOut) {
          this.trigger("enterView");
          isOut = false;
        }
        if (opt.hide) this.hidden = false;
        if (opt.pause) this.paused = false;
      }
    }
  };
}

// src/components/transform/pos.ts
function pos(...args) {
  return {
    id: "pos",
    pos: vec2(...args),
    moveBy(...args2) {
      this.pos = this.pos.add(vec2(...args2));
    },
    // move with velocity (pixels per second)
    move(...args2) {
      this.moveBy(vec2(...args2).scale(k.dt()));
    },
    // move to a destination, with optional speed
    // Adress all ts ignores
    moveTo(...args2) {
      if (typeof args2[0] === "number" && typeof args2[1] === "number") {
        return this.moveTo(vec2(args2[0], args2[1]), args2[2]);
      }
      const dest = args2[0];
      const speed = args2[1];
      if (speed === void 0) {
        this.pos = vec2(dest);
        return;
      }
      const diff = dest.sub(this.pos);
      if (diff.len() <= speed * k.dt()) {
        this.pos = vec2(dest);
        return;
      }
      this.move(diff.unit().scale(speed));
    },
    // Get the position of the object relative to the root
    worldPos(pos2 = null) {
      if (pos2) {
        this.pos = this.pos.add(this.fromWorld(pos2));
        return null;
      } else {
        return this.parent ? this.parent.transform.multVec2(this.pos) : this.pos;
      }
    },
    // Transform a local point to a world point
    toWorld(p) {
      return this.parent ? this.parent.transform.multVec2(this.pos.add(p)) : this.pos.add(p);
    },
    // Transform a world point (relative to the root) to a local point (relative to this)
    fromWorld(p) {
      return this.parent ? this.parent.transform.invert().multVec2(p).sub(this.pos) : p.sub(this.pos);
    },
    // Transform a screen point (relative to the camera) to a local point (relative to this)
    screenPos(pos2 = null) {
      if (pos2) {
        this.pos = this.pos.add(this.fromScreen(pos2));
        return null;
      } else {
        const pos3 = this.worldPos();
        if (!pos3) {
          return null;
        }
        return isFixed(this) ? pos3 : k.toScreen(pos3);
      }
    },
    // Transform a local point (relative to this) to a screen point (relative to the camera)
    toScreen(p) {
      const pos2 = this.toWorld(p);
      return isFixed(this) ? pos2 : k.toScreen(pos2);
    },
    // Transform a screen point (relative to the camera) to a local point (relative to this)
    fromScreen(p) {
      return isFixed(this) ? this.fromWorld(p) : this.fromWorld(k.toWorld(p));
    },
    // Transform a point relative to this to a point relative to other
    toOther(other, p) {
      return other.fromWorld(this.toWorld(p));
    },
    // Transform a point relative to other to a point relative to this
    fromOther(other, p) {
      return other.toOther(this, p);
    },
    inspect() {
      return `pos: (${Math.round(this.pos.x)}x, ${Math.round(this.pos.y)}y)`;
    },
    drawInspect() {
      k.drawCircle({
        color: k.rgb(255, 0, 0),
        radius: 4 / getViewportScale()
      });
    }
  };
}

// src/components/transform/rotate.ts
function rotate(r) {
  return {
    id: "rotate",
    angle: r ?? 0,
    rotateBy(angle) {
      this.angle += angle;
    },
    rotateTo(angle) {
      this.angle = angle;
    },
    inspect() {
      return `angle: ${Math.round(this.angle)}`;
    }
  };
}

// src/components/transform/scale.ts
function scale(...args) {
  if (args.length === 0) {
    return scale(1);
  }
  let _scale = vec2(...args);
  return {
    id: "scale",
    set scale(value) {
      if (value instanceof Vec2 === false) {
        throw Error(
          "The scale property on scale is a vector. Use scaleTo or scaleBy to set the scale with a number."
        );
      }
      _scale = vec2(value);
    },
    get scale() {
      return _scale;
    },
    scaleTo(...args2) {
      _scale = vec2(...args2);
    },
    scaleBy(...args2) {
      _scale = _scale.scale(vec2(...args2));
    },
    inspect() {
      if (_scale.x == _scale.y) {
        return `scale: ${_scale.x.toFixed(1)}x`;
      } else {
        return `scale: (${_scale.x.toFixed(1)}x, ${_scale.y.toFixed(1)}y)`;
      }
    }
  };
}

// src/components/transform/z.ts
function z(z2) {
  return {
    id: "z",
    z: z2,
    inspect() {
      return `z: ${this.z}`;
    }
  };
}

// src/kassets/boom.png
var boom_default = "data:image/png;base64,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";

// src/kassets/ka.png
var ka_default = "data:image/png;base64,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";

// src/kaplay.ts
var VERSION = "3001.0.0";
var k;
var globalOpt;
var gfx;
var game;
var app;
var assets;
var fontCacheCanvas;
var fontCacheC2d;
var debug;
var audio;
var pixelDensity;
var canvas;
var gscale;
var kaSprite;
var boomSprite;
var kaplay = (gopt = {}) => {
  globalOpt = gopt;
  const root = gopt.root ?? document.body;
  if (root === document.body) {
    document.body.style["width"] = "100%";
    document.body.style["height"] = "100%";
    document.body.style["margin"] = "0px";
    document.documentElement.style["width"] = "100%";
    document.documentElement.style["height"] = "100%";
  }
  canvas = gopt.canvas ?? root.appendChild(document.createElement("canvas"));
  gscale = gopt.scale ?? 1;
  const fixedSize = gopt.width && gopt.height && !gopt.stretch && !gopt.letterbox;
  if (fixedSize) {
    canvas.width = gopt.width * gscale;
    canvas.height = gopt.height * gscale;
  } else {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  const styles = [
    "outline: none",
    "cursor: default"
  ];
  if (fixedSize) {
    const cw = canvas.width;
    const ch = canvas.height;
    styles.push(`width: ${cw}px`);
    styles.push(`height: ${ch}px`);
  } else {
    styles.push("width: 100%");
    styles.push("height: 100%");
  }
  if (gopt.crisp) {
    styles.push("image-rendering: pixelated");
    styles.push("image-rendering: crisp-edges");
  }
  canvas.style.cssText = styles.join(";");
  pixelDensity = gopt.pixelDensity || 1;
  canvas.width *= pixelDensity;
  canvas.height *= pixelDensity;
  canvas.tabIndex = 0;
  fontCacheCanvas = document.createElement("canvas");
  fontCacheCanvas.width = MAX_TEXT_CACHE_SIZE;
  fontCacheCanvas.height = MAX_TEXT_CACHE_SIZE;
  fontCacheC2d = fontCacheCanvas.getContext("2d", {
    willReadFrequently: true
  });
  app = initApp({
    canvas,
    touchToMouse: gopt.touchToMouse,
    gamepads: gopt.gamepads,
    pixelDensity: gopt.pixelDensity,
    maxFPS: gopt.maxFPS,
    buttons: gopt.buttons
  });
  const gc = [];
  const canvasContext = app.canvas.getContext("webgl", {
    antialias: true,
    depth: true,
    stencil: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  if (!canvasContext) throw new Error("WebGL not supported");
  const gl = canvasContext;
  const ggl = initGfx(gl, {
    texFilter: gopt.texFilter
  });
  gfx = initAppGfx(gopt, ggl);
  audio = initAudio();
  assets = initAssets(ggl);
  game = initGame();
  game.root.use(timer());
  function makeCanvas(w, h) {
    const fb = new FrameBuffer(ggl, w, h);
    return {
      clear: () => fb.clear(),
      free: () => fb.free(),
      toDataURL: () => fb.toDataURL(),
      toImageData: () => fb.toImageData(),
      width: fb.width,
      height: fb.height,
      draw: (action) => {
        flush();
        fb.bind();
        action();
        flush();
        fb.unbind();
      }
    };
  }
  function frameStart() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gfx.frameBuffer.bind();
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!gfx.bgColor) {
      drawUnscaled(() => {
        drawUVQuad({
          width: width(),
          height: height(),
          quad: new Quad(
            0,
            0,
            width() / BG_GRID_SIZE,
            height() / BG_GRID_SIZE
          ),
          tex: gfx.bgTex,
          fixed: true
        });
      });
    }
    gfx.renderer.numDraws = 0;
    gfx.fixed = false;
    gfx.transformStack.length = 0;
    gfx.transform = new Mat4();
  }
  function usePostEffect(name, uniform) {
    gfx.postShader = name;
    gfx.postShaderUniform = uniform ?? null;
  }
  function frameEnd() {
    flush();
    gfx.lastDrawCalls = gfx.renderer.numDraws;
    gfx.frameBuffer.unbind();
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    const ow = gfx.width;
    const oh = gfx.height;
    gfx.width = gl.drawingBufferWidth / pixelDensity;
    gfx.height = gl.drawingBufferHeight / pixelDensity;
    drawTexture({
      flipY: true,
      tex: gfx.frameBuffer.tex,
      pos: new Vec2(gfx.viewport.x, gfx.viewport.y),
      width: gfx.viewport.width,
      height: gfx.viewport.height,
      shader: gfx.postShader,
      uniform: typeof gfx.postShaderUniform === "function" ? gfx.postShaderUniform() : gfx.postShaderUniform,
      fixed: true
    });
    flush();
    gfx.width = ow;
    gfx.height = oh;
  }
  let debugPaused = false;
  debug = {
    inspect: false,
    timeScale: 1,
    showLog: true,
    fps: () => app.fps(),
    numFrames: () => app.numFrames(),
    stepFrame: updateFrame,
    drawCalls: () => gfx.lastDrawCalls,
    clearLog: () => game.logs = [],
    log: (msg) => {
      const max = gopt.logMax ?? LOG_MAX;
      game.logs.unshift({
        msg,
        time: app.time()
      });
      if (game.logs.length > max) {
        game.logs = game.logs.slice(0, max);
      }
    },
    error: (msg) => debug.log(new Error(msg.toString ? msg.toString() : msg)),
    curRecording: null,
    numObjects: () => get("*", { recursive: true }).length,
    get paused() {
      return debugPaused;
    },
    set paused(v) {
      debugPaused = v;
      if (v) {
        audio.ctx.suspend();
      } else {
        audio.ctx.resume();
      }
    }
  };
  function getData(key, def) {
    try {
      return JSON.parse(window.localStorage[key]);
    } catch {
      if (def) {
        setData(key, def);
        return def;
      } else {
        return null;
      }
    }
  }
  function setData(key, data) {
    window.localStorage[key] = JSON.stringify(data);
  }
  function plug(plugin, ...args) {
    const funcs = plugin(k);
    let funcsObj;
    if (typeof funcs === "function") {
      const plugWithOptions = funcs(...args);
      funcsObj = plugWithOptions(k);
    } else {
      funcsObj = funcs;
    }
    for (const key in funcsObj) {
      k[key] = funcsObj[key];
      if (gopt.global !== false) {
        window[key] = funcsObj[key];
      }
    }
    return k;
  }
  function record(frameRate) {
    const stream = app.canvas.captureStream(frameRate);
    const audioDest = audio.ctx.createMediaStreamDestination();
    audio.masterNode.connect(audioDest);
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    recorder.onerror = () => {
      audio.masterNode.disconnect(audioDest);
      stream.getTracks().forEach((t) => t.stop());
    };
    recorder.start();
    return {
      resume() {
        recorder.resume();
      },
      pause() {
        recorder.pause();
      },
      stop() {
        recorder.stop();
        audio.masterNode.disconnect(audioDest);
        stream.getTracks().forEach((t) => t.stop());
        return new Promise((resolve) => {
          recorder.onstop = () => {
            resolve(
              new Blob(chunks, {
                type: "video/mp4"
              })
            );
          };
        });
      },
      download(filename = "kaboom.mp4") {
        this.stop().then((blob) => downloadBlob(filename, blob));
      }
    };
  }
  function isFocused() {
    return document.activeElement === app.canvas;
  }
  const add = game.root.add.bind(game.root);
  const readd = game.root.readd.bind(game.root);
  const destroyAll = game.root.removeAll.bind(game.root);
  const get = game.root.get.bind(game.root);
  const wait = game.root.wait.bind(game.root);
  const loop = game.root.loop.bind(game.root);
  const query = game.root.query.bind(game.root);
  const tween = game.root.tween.bind(game.root);
  kaSprite = loadSprite(null, ka_default);
  boomSprite = loadSprite(null, boom_default);
  function fixedUpdateFrame() {
    game.root.fixedUpdate();
  }
  function updateFrame() {
    game.root.update();
  }
  class Collision {
    source;
    target;
    normal;
    distance;
    resolved = false;
    constructor(source, target, normal, distance, resolved = false) {
      this.source = source;
      this.target = target;
      this.normal = normal;
      this.distance = distance;
      this.resolved = resolved;
    }
    get displacement() {
      return this.normal.scale(this.distance);
    }
    reverse() {
      return new Collision(
        this.target,
        this.source,
        this.normal.scale(-1),
        this.distance,
        this.resolved
      );
    }
    hasOverlap() {
      return !this.displacement.isZero();
    }
    isLeft() {
      return this.displacement.cross(game.gravity || vec2(0, 1)) > 0;
    }
    isRight() {
      return this.displacement.cross(game.gravity || vec2(0, 1)) < 0;
    }
    isTop() {
      return this.displacement.dot(game.gravity || vec2(0, 1)) > 0;
    }
    isBottom() {
      return this.displacement.dot(game.gravity || vec2(0, 1)) < 0;
    }
    preventResolution() {
      this.resolved = true;
    }
  }
  function checkFrame() {
    if (!usesArea()) {
      return;
    }
    const grid = {};
    const cellSize = gopt.hashGridSize || DEF_HASH_GRID_SIZE;
    let tr = new Mat4();
    const stack = [];
    function checkObj(obj) {
      stack.push(tr.clone());
      if (obj.pos) tr.translate(obj.pos);
      if (obj.scale) tr.scale(obj.scale);
      if (obj.angle) tr.rotate(obj.angle);
      obj.transform = tr.clone();
      if (obj.c("area") && !obj.paused) {
        const aobj = obj;
        const area2 = aobj.worldArea();
        const bbox = area2.bbox();
        const xmin = Math.floor(bbox.pos.x / cellSize);
        const ymin = Math.floor(bbox.pos.y / cellSize);
        const xmax = Math.ceil((bbox.pos.x + bbox.width) / cellSize);
        const ymax = Math.ceil((bbox.pos.y + bbox.height) / cellSize);
        const checked = /* @__PURE__ */ new Set();
        for (let x = xmin; x <= xmax; x++) {
          for (let y = ymin; y <= ymax; y++) {
            if (!grid[x]) {
              grid[x] = {};
              grid[x][y] = [aobj];
            } else if (!grid[x][y]) {
              grid[x][y] = [aobj];
            } else {
              const cell = grid[x][y];
              check: for (const other of cell) {
                if (other.paused) continue;
                if (!other.exists()) continue;
                if (checked.has(other.id)) continue;
                for (const tag of aobj.collisionIgnore) {
                  if (other.is(tag)) {
                    continue check;
                  }
                }
                for (const tag of other.collisionIgnore) {
                  if (aobj.is(tag)) {
                    continue check;
                  }
                }
                const res = sat(
                  aobj.worldArea(),
                  other.worldArea()
                );
                if (res) {
                  const col1 = new Collision(
                    aobj,
                    other,
                    res.normal,
                    res.distance
                  );
                  aobj.trigger("collideUpdate", other, col1);
                  const col2 = col1.reverse();
                  col2.resolved = col1.resolved;
                  other.trigger("collideUpdate", aobj, col2);
                }
                checked.add(other.id);
              }
              cell.push(aobj);
            }
          }
        }
      }
      obj.children.forEach(checkObj);
      tr = stack.pop();
    }
    checkObj(game.root);
  }
  function handleErr(err) {
    console.error(err);
    audio.ctx.suspend();
    const errorMessage = err.message ?? String(err) ?? "Unknown error, check console for more info";
    app.run(
      () => {
      },
      () => {
        frameStart();
        drawUnscaled(() => {
          const pad = 32;
          const gap = 16;
          const gw = width();
          const gh = height();
          const textStyle = {
            size: 36,
            width: gw - pad * 2,
            letterSpacing: 4,
            lineSpacing: 4,
            font: DBG_FONT,
            fixed: true
          };
          drawRect({
            width: gw,
            height: gh,
            color: rgb(0, 0, 255),
            fixed: true
          });
          const title = formatText({
            ...textStyle,
            text: "Error",
            pos: vec2(pad),
            color: rgb(255, 128, 0),
            fixed: true
          });
          drawFormattedText(title);
          drawText({
            ...textStyle,
            text: errorMessage,
            pos: vec2(pad, pad + title.height + gap),
            fixed: true
          });
          popTransform();
          game.events.trigger("error", err);
        });
        frameEnd();
      }
    );
  }
  function onCleanup(action) {
    gc.push(action);
  }
  function quit() {
    game.events.onOnce("frameEnd", () => {
      app.quit();
      gl.clear(
        gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT
      );
      const numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      for (let unit = 0; unit < numTextureUnits; unit++) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      ggl.destroy();
      gc.forEach((f) => f());
    });
  }
  let isFirstFrame = true;
  app.run(
    () => {
      try {
        if (assets.loaded) {
          if (!debug.paused) fixedUpdateFrame();
          checkFrame();
        }
      } catch (e) {
        handleErr(e);
      }
    },
    (processInput, resetInput) => {
      try {
        processInput();
        if (!assets.loaded) {
          if (loadProgress() === 1 && !isFirstFrame) {
            assets.loaded = true;
            game.events.trigger("load");
          }
        }
        if (!assets.loaded && gopt.loadingScreen !== false || isFirstFrame) {
          frameStart();
          drawLoadScreen();
          frameEnd();
        } else {
          if (!debug.paused) updateFrame();
          checkFrame();
          frameStart();
          drawFrame();
          if (gopt.debug !== false) drawDebug();
          frameEnd();
        }
        if (isFirstFrame) {
          isFirstFrame = false;
        }
        game.events.trigger("frameEnd");
        resetInput();
      } catch (e) {
        handleErr(e);
      }
    }
  );
  updateViewport();
  initEvents();
  k = {
    VERSION,
    // asset load
    loadRoot,
    loadProgress,
    loadSprite,
    loadSpriteAtlas,
    loadSound,
    loadMusic,
    loadBitmapFont,
    loadFont,
    loadShader,
    loadShaderURL,
    loadAseprite,
    loadPedit,
    loadBean,
    loadJSON,
    load,
    getSound,
    getFont,
    getBitmapFont,
    getSprite,
    getShader,
    getAsset,
    Asset,
    SpriteData,
    SoundData,
    // query
    width,
    height,
    center,
    dt,
    fixedDt,
    restDt,
    time: app.time,
    screenshot: app.screenshot,
    record,
    isFocused,
    setCursor: app.setCursor,
    getCursor: app.getCursor,
    setCursorLocked: app.setCursorLocked,
    isCursorLocked: app.isCursorLocked,
    setFullscreen: app.setFullscreen,
    isFullscreen: app.isFullscreen,
    isTouchscreen: app.isTouchscreen,
    onLoad,
    onLoading,
    onResize,
    onGamepadConnect: app.onGamepadConnect,
    onGamepadDisconnect: app.onGamepadDisconnect,
    onError,
    onCleanup,
    // misc
    camPos,
    camScale,
    camFlash,
    camRot,
    camTransform,
    shake,
    toScreen,
    toWorld,
    setGravity,
    getGravity,
    setGravityDirection,
    getGravityDirection,
    setBackground,
    getBackground,
    getGamepads: app.getGamepads,
    // obj
    getTreeRoot,
    add,
    make,
    destroy,
    destroyAll,
    get,
    query,
    readd,
    // comps
    pos,
    scale,
    rotate,
    color,
    opacity,
    anchor,
    area,
    sprite,
    text,
    polygon,
    rect,
    circle,
    uvquad,
    outline,
    particles,
    body,
    surfaceEffector,
    areaEffector,
    pointEffector,
    buoyancyEffector,
    constantForce,
    doubleJump,
    shader,
    textInput,
    timer,
    fixed,
    stay,
    health,
    lifespan,
    named,
    state,
    z,
    layer,
    move,
    offscreen,
    follow,
    fadeIn,
    mask,
    drawon,
    raycast,
    tile,
    animate,
    serializeAnimation,
    agent,
    sentry,
    patrol,
    navigation,
    // group events
    on,
    onFixedUpdate,
    onUpdate,
    onDraw,
    onAdd,
    onDestroy,
    onClick,
    onCollide,
    onCollideUpdate,
    onCollideEnd,
    onHover,
    onHoverUpdate,
    onHoverEnd,
    // input
    onKeyDown: app.onKeyDown,
    onKeyPress: app.onKeyPress,
    onKeyPressRepeat: app.onKeyPressRepeat,
    onKeyRelease: app.onKeyRelease,
    onMouseDown: app.onMouseDown,
    onMousePress: app.onMousePress,
    onMouseRelease: app.onMouseRelease,
    onMouseMove: app.onMouseMove,
    onCharInput: app.onCharInput,
    onTouchStart: app.onTouchStart,
    onTouchMove: app.onTouchMove,
    onTouchEnd: app.onTouchEnd,
    onScroll: app.onScroll,
    onHide: app.onHide,
    onShow: app.onShow,
    onGamepadButtonDown: app.onGamepadButtonDown,
    onGamepadButtonPress: app.onGamepadButtonPress,
    onGamepadButtonRelease: app.onGamepadButtonRelease,
    onGamepadStick: app.onGamepadStick,
    onButtonPress: app.onButtonPress,
    onButtonDown: app.onButtonDown,
    onButtonRelease: app.onButtonRelease,
    mousePos,
    mouseDeltaPos: app.mouseDeltaPos,
    isKeyDown: app.isKeyDown,
    isKeyPressed: app.isKeyPressed,
    isKeyPressedRepeat: app.isKeyPressedRepeat,
    isKeyReleased: app.isKeyReleased,
    isMouseDown: app.isMouseDown,
    isMousePressed: app.isMousePressed,
    isMouseReleased: app.isMouseReleased,
    isMouseMoved: app.isMouseMoved,
    isGamepadButtonPressed: app.isGamepadButtonPressed,
    isGamepadButtonDown: app.isGamepadButtonDown,
    isGamepadButtonReleased: app.isGamepadButtonReleased,
    getGamepadStick: app.getGamepadStick,
    isButtonPressed: app.isButtonPressed,
    isButtonDown: app.isButtonDown,
    isButtonReleased: app.isButtonReleased,
    setButton: app.setButton,
    getButton: app.getButton,
    getLastInputDeviceType: app.getLastInputDeviceType,
    charInputted: app.charInputted,
    // timer
    loop,
    wait,
    // audio
    play,
    volume,
    burp,
    audioCtx: audio.ctx,
    // math
    Line,
    Rect,
    Circle,
    Ellipse,
    Point,
    Polygon,
    Vec2,
    Color,
    Mat4,
    Quad,
    RNG,
    rand,
    randi,
    randSeed,
    vec2,
    rgb,
    hsl2rgb,
    quad,
    choose,
    chooseMultiple,
    shuffle,
    chance,
    lerp,
    tween,
    easings: easings_default,
    map,
    mapc,
    wave,
    deg2rad,
    rad2deg,
    clamp,
    evaluateQuadratic,
    evaluateQuadraticFirstDerivative,
    evaluateQuadraticSecondDerivative,
    evaluateBezier,
    evaluateBezierFirstDerivative,
    evaluateBezierSecondDerivative,
    evaluateCatmullRom,
    evaluateCatmullRomFirstDerivative,
    curveLengthApproximation,
    normalizedCurve,
    hermite,
    cardinal,
    catmullRom,
    bezier,
    kochanekBartels,
    easingSteps,
    easingLinear,
    easingCubicBezier,
    testLineLine,
    testRectRect,
    testRectLine,
    testRectPoint,
    testCirclePolygon,
    testLinePoint,
    testLineCircle,
    isConvex,
    triangulate,
    NavMesh,
    // raw draw
    drawSprite,
    drawText,
    formatText,
    drawRect,
    drawLine,
    drawLines,
    drawTriangle,
    drawCircle,
    drawEllipse,
    drawUVQuad,
    drawPolygon,
    drawCurve,
    drawBezier,
    drawFormattedText,
    drawMasked,
    drawSubtracted,
    pushTransform,
    popTransform,
    pushTranslate,
    pushScale,
    pushRotate,
    pushMatrix,
    usePostEffect,
    makeCanvas,
    // debug
    debug,
    // scene
    scene,
    getSceneName,
    go,
    onSceneLeave,
    // layers
    layers,
    // level
    addLevel,
    // storage
    getData,
    setData,
    download,
    downloadJSON,
    downloadText,
    downloadBlob,
    // plugin
    plug,
    // char sets
    ASCII_CHARS,
    // dom
    canvas: app.canvas,
    // misc
    addKaboom,
    // dirs
    LEFT: Vec2.LEFT,
    RIGHT: Vec2.RIGHT,
    UP: Vec2.UP,
    DOWN: Vec2.DOWN,
    // colors
    RED: Color.RED,
    GREEN: Color.GREEN,
    BLUE: Color.BLUE,
    YELLOW: Color.YELLOW,
    MAGENTA: Color.MAGENTA,
    CYAN: Color.CYAN,
    WHITE: Color.WHITE,
    BLACK: Color.BLACK,
    quit,
    // helpers
    KEvent,
    KEventHandler,
    KEventController
  };
  const plugins = gopt.plugins;
  if (plugins) {
    plugins.forEach(plug);
  }
  if (gopt.global !== false) {
    for (const key in k) {
      window[key] = k[key];
    }
  }
  if (gopt.focus !== false) {
    app.canvas.focus();
  }
  return k;
};

// src/index.ts
var src_default = kaplay;
export {
  src_default as default
};
