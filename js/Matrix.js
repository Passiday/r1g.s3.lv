// Matrix class helps to carry out the matrix calculations

function MatrixException(errorInfo, params) {
    this.errorInfo = errorInfo;
    if (!errorInfo) throw new TypeError("The errorInfo object is not a valid object");
}
MatrixException.prototype.toString = function() {
    return this.errorInfo.description;
}
MatrixException.errors = {
    BAD_VALUE   : {number:1, description:"The number of elements must match the size of the matrix."},
    BAD_INDEX   : {number:2, description:"Element index out of bounds."},
    ADD_MISMATCH: {number:3, description:"In matrix addition both matrices must be of equal dimensions."},
    MUL_MISMATCH: {number:4, description:"In matrix multiplication the number of columns in the 1st matrix must be equal to the number of rows in the 2nd matrix."}
}

function Matrix(m, n, elements) {
    this.m = m; // Number of rows
    this.n = n; // Number of columns
    this.elements = []; // The elements are stored in the array from left to right, then down
    if (elements.length != m * n) throw new MatrixException(MatrixException.errors.BAD_VALUE);
    this.elements = elements;
}
Matrix.prototype.getElement = function(r, c) {
    if (r > this.m || c > this.n) throw new MatrixException(MatrixException.errors.BAD_INDEX);
    return this.elements[r * this.n + c];
}
Matrix.prototype.setElement = function(r, c, value) {
    if (r > this.m || c > this.n) throw new MatrixException(MatrixException.errors.BAD_INDEX);
    this.elements[r * this.n + c] = value;
}
Matrix.prototype.clone = function() {
    return new Matrix(this.m, this.n, this.elements.slice());
}
Matrix.prototype.add = function(m2) {
    if (this.m != m2.m || this.n != m2.n) throw new MatrixException(MatrixException.errors.ADD_MISMATCH);
    var result = [];
    for (var elementi = 0; elementi < this.elements.length; elementi++) {
        result[elementi] = this.elements[elementi] + m2.elements[elementi];
    }
    return new Matrix(this.m, this.n, result);
}
Matrix.prototype.sub = function(m2) {
    if (this.m != m2.m || this.n != m2.n) throw new MatrixException(MatrixException.errors.ADD_MISMATCH);
    var result = [];
    for (var elementi = 0; elementi < this.elements.length; elementi++) {
        result[elementi] = this.elements[elementi] - m2.elements[elementi];
    }
    return new Matrix(this.m, this.n, result);
}
Matrix.prototype.mulC = function(C) {
    var result = [];
    for (var elementi = 0; elementi < this.elements.length; elementi++) {
        result[elementi] = this.elements[elementi] * C;
    }
    return new Matrix(this.m, this.n, result);
}
Matrix.prototype.mul = function(m2) {
    if (this.n != m2.m) throw new MatrixException(MatrixException.errors.MUL_MISMATCH);
    // The resulting matrix dimensions will be (this.m, m2.n)
    var result = [];
    for (var ri = 0; ri < this.m; ri++) {
        for (var ci = 0; ci < m2.n; ci++) {
            var elementi = ri * m2.n + ci;
            result[elementi] = 0;
            for (var ei = 0; ei < this.n; ei++) {
                result[elementi] += this.elements[ri * this.n + ei] * m2.elements[ei * m2.n + ci];
            }
        }
    }
    return new Matrix(this.m, m2.n, result);
}

Matrix.i = function(n) {
    // Returns the identity matrix of order n
    var result = [];
    var elementi = 0;
    for (var ri = 0; ri < n; ri++) {
        for (var ci = 0; ci < n; ci++) {
            result[elementi++] = ri == ci ? 1 : 0;
        }
    }
    return new Matrix(n, n, result);
}


/*
Test code for the Matrix calculations
a = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
b = new Matrix(3, 2, [7, 8, 9, 10, 11, 12]);
Matrix.mul(a, b)
*/