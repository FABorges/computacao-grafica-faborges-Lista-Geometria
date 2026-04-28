class Vec4 {
    constructor(x, y, z, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    scale(s) {
        return new Vec4(this.x * s, this.y * s, this.z * s, this.w);
    }


    add(v) {
        return new Vec4(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z,
            this.w
        );
    }

    static subtract(a, b) {
        return new Vec4(
            a.x - b.x,
            a.y - b.y,
            a.z - b.z,
            0.0 // vetor → w = 0
        );
    }

    norm() {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    }

    normalize() {
        const n = this.norm();
        return new Vec4(this.x / n, this.y / n, this.z / n, this.w);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vec4(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x,
            0.0
        );
    }

    angle(v) {
        const cos = this.dot(v) / (this.norm() * v.norm());
        return Math.acos(cos); // radianos
    }

    static affineCombination(p, q, t) {
        // (1-t)p + tq
        return new Vec4(
            (1 - t) * p.x + t * q.x,
            (1 - t) * p.y + t * q.y,
            (1 - t) * p.z + t * q.z,
            1.0
        );
    }
}
class Mat4 {
    constructor(elements) {
        this.m = elements || Mat4.identity().m;
    }

    static identity() {
        return new Mat4([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]);
    }

    static translate(tx, ty, tz) {
        return new Mat4([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            tx,ty,tz,1
        ]);
    }

    static scale(sx, sy, sz) {
        return new Mat4([
            sx,0,0,0,
            0,sy,0,0,
            0,0,sz,0,
            0,0,0,1
        ]);
    }

    static rotateX(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);

        return new Mat4([
            1,0,0,0,
            0,c,s,0,
            0,-s,c,0,
            0,0,0,1
        ]);
    }

    static rotateY(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);

        return new Mat4([
            c,0,-s,0,
            0,1,0,0,
            s,0,c,0,
            0,0,0,1
        ]);
    }

    static rotateZ(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);

        return new Mat4([
            c,s,0,0,
            -s,c,0,0,
            0,0,1,0,
            0,0,0,1
        ]);
    }

    static mult(A, B) {
        const a = A.m;
        const b = B.m;
        const r = new Array(16).fill(0);

        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                for (let k = 0; k < 4; k++) {
                    r[col*4 + row] += a[k*4 + row] * b[col*4 + k];
                }
            }
        }

        return new Mat4(r);
    }

    static ortho(l, r, b, t, n, f) {
        return new Mat4([
            2/(r-l), 0, 0, 0,
            0, 2/(t-b), 0, 0,
            0, 0, -2/(f-n), 0,
            -(r+l)/(r-l), -(t+b)/(t-b), -(f+n)/(f-n), 1
        ]);
    }

    static perspective(fovY, aspect, n, f) {
        const fov = 1 / Math.tan(fovY / 2);

        return new Mat4([
            fov/aspect, 0, 0, 0,
            0, fov, 0, 0,
            0, 0, (f+n)/(n-f), -1,
            0, 0, (2*f*n)/(n-f), 0
        ]);
    }

    asFloat32Array() {
        return new Float32Array(this.m);
    }
}