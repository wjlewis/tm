// Much of the work in rendering the components in this app can be reduced by
// expressing positions and operations in vector form. This class provides all
// the functionality we need in this regard in a self-contained package.

class Vector {
  constructor(public x: number, public y: number) {}

  static from({ x, y }: SerializableVector): Vector {
    return new Vector(x, y);
  }

  // Return the length of this vector.
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Return a unit vector that shares this vector's direction
  normalize() {
    const len = this.magnitude();
    if (len === 0) {
      throw new Error('Cannot normalize 0 vector');
    }
    return new Vector(this.x / len, this.y / len);
  }

  // Return a vector perpendicular to this vector (with the same length). NOTE:
  // this effectively rotates the vector 90 deg clockwise.
  perp() {
    return new Vector(-this.y, this.x);
  }

  // Return the sum of this vector and the input.
  plus(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  // Return the difference between this vector and the input.
  minus(v: Vector) {
    return this.plus(v.scale(-1));
  }

  // Scale this vector by the specified amount.
  scale(factor: number) {
    return new Vector(factor * this.x, factor * this.y);
  }

  // Return this vector's angle.
  angle() {
    return Math.atan2(this.y, this.x);
  }

  // Project this vector onto the input vector.
  project(v: Vector) {
    return v.scale(this.dot(v) / v.dot(v));
  }

  // Return the dot product of this vector and the input vector.
  dot(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }
}

// A RawVector contains the same data as a Vector (i.e. an x and y coordinate),
// but has none of the associated methods. It is suitable for serialization, and
// for this reason, we use it everywhere we might need a serializable vector.
export interface SerializableVector {
  x: number;
  y: number;
}

export default Vector;
