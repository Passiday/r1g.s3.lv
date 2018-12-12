
/*
Depends on: Matrix.js
*/

// Vertex2D - represents a vertex in 2D space, has set of affine xformation methods

function Vertex2D(x, y) {
    this.x = x;
    this.y = y;
}
Vertex2D.prototype.copy = function() {
    // This function returns new vertex object!
    return new Vertex2D(this.x, this.y);
}
Vertex2D.prototype.xform = function(matrix) {
    // Note: method does not modify this vertex, it returns new vertex object.
    // The matrix dimensions must be 2x2
    var v = new Matrix(2, 1, [this.x, this.y]);
    var t = matrix.mul(v);
    return new Vertex2D(t.elements[0], t.elements[1]);
}
Vertex2D.prototype.translate = function(tx, ty) {
    // Note: method does not modify this vertex, it returns new vertex object.
    var v = new Matrix(2, 1, [this.x, this.y]);
    var t = v.add(new Matrix(2, 1, [tx, ty]));
    return new Vertex2D(t.elements[0], t.elements[1]);
}
Vertex2D.prototype.rotate = function(angle) {
    // Note: method does not modify this vertex, it returns new vertex object.
    return this.xform(new Matrix(2, 2, [
        Math.cos(angle),-Math.sin(angle),
        Math.sin(angle), Math.cos(angle)
    ]));
}
Vertex2D.prototype.scale = function(sx, sy) {
    // This function returns new vertex object!
    return this.xform(new Matrix(2, 2, [
        sx, 0,
        0 , sy
    ]));
}

// Vertex3D - represents a vertex in 3D space, has set of affine xformation methods

function Vertex3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}
Vertex3D.prototype.copy = function() {
    // This function returns new vertex object!
    return new Vertex3D(this.x, this.y, this.z);
}
Vertex3D.prototype.xform = function(matrix) {
    // Note: method does not modify this vertex, it returns new vertex object.
    // The matrix dimensions must be 3x3
    var v = new Matrix(3, 1, [this.x, this.y, this.z]);
    var t = matrix.mul(v);
    return new Vertex3D(t.elements[0], t.elements[1], t.elements[2]);
}
Vertex3D.prototype.translate = function(tx, ty, tz) {
    // Note: method does not modify this vertex, it returns new vertex object.
    var v = new Matrix(3, 1, [this.x, this.y, this.z]);
    var t = v.add(new Matrix(3, 1, [tx, ty, tz]));
    return new Vertex3D(t.elements[0], t.elements[1], t.elements[2]);
}
Vertex3D.prototype.rotateYZ = function(angle) {
    // Note: method does not modify this vertex, it returns new vertex object.
    return this.xform(new Matrix(3, 3, [
        1, 0              , 0,
        0, Math.cos(angle),-Math.sin(angle),
        0, Math.sin(angle), Math.cos(angle)
    ]));
}
Vertex3D.prototype.rotateZX = function(angle) {
    // Note: method does not modify this vertex, it returns new vertex object.
    return this.xform(new Matrix(3, 3, [
        Math.cos(angle), 0, Math.sin(angle),
        0              , 1, 0,
       -Math.sin(angle), 0, Math.cos(angle)
    ]));
}
Vertex3D.prototype.rotateXY = function(angle) {
    // Note: method does not modify this vertex, it returns new vertex object.
    return this.xform(new Matrix(3, 3, [
        Math.cos(angle),-Math.sin(angle), 0,
        Math.sin(angle), Math.cos(angle), 0, 
        0              , 0              , 1
    ]));
}
Vertex3D.prototype.rotateV = function(v, angle) {
    // Note: method does not modify this vertex, it returns new vertex object.
    // Rotate around the axis formed by vector (0, v) (formula from http://en.wikipedia.org/wiki/Rotation_matrix, section "Rotation matrix from axis and angle")
    var vd = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
    if (!vd) return this.copy();
    var vx = v.x / vd;
    var vy = v.y / vd;
    var vz = v.z / vd;
    var r1 = Matrix.i(3).mulC(Math.cos(angle));
    var r2 = new Matrix(3, 3, [
         0 ,-vz, vy,
         vz, 0 ,-vx,
        -vy, vx, 0
    ]).mulC(Math.sin(angle));
    var r3 = new Matrix(3, 3, [
        vx*vx, vx*vy, vx*vz,
        vx*vy, vy*vy, vy*vz,
        vx*vz, vy*vz, vz*vz
    ]).mulC(1 - Math.cos(angle));
    var R = r1.add(r2).add(r3);
    return this.xform(R);
}
Vertex3D.prototype.scale = function(sx, sy, sz) {
    // This function returns new vertex object!
    return this.xform(new Matrix(3, 3, [
        sx, 0 , 0,
        0 , sy, 0, 
        0 , 0 , sz
    ]));
}
