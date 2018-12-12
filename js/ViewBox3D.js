/*
ViewBox3D class provides means to study 3D data, as expressed by collection of points and lines.
- Mouseover the data points gives extra info in html popup
- Click on the data point selects it.
- Shift-click adds the data point to the existing selection
- Info window displays information about the selection - list of point names, distance between them, total distance, etc. 

Depends on: SVGBuilder.js, Matrix.js
*/


function ViewBox3D() {
    this.mode = "view";
    this.parentOffset = null;
    this.dragStart = {x:0, y:0}; // Local coords of the point where the dragging started
    this.dragTime = null; // Time when the dragging started
    this.dragEnd = {x:0, y:0}; // Local coords of the present mouse point
    this.rotateAxis = null;
    // Init the plot orientation and camera position
    /*
    this.scaleX = 1; // 4th transform: scale along x axis
    this.scaleY = 1; // 5th transform: scale along y axis
    this.scaleZ = 1; // 6th transform: scale along z axis
    */
    this.camera = {x:0, y:0, z:2000};
    this.focus = 990;
    this.localOffset = {x:400, y:400};
    // Init the data sets
    this.dataSet = {};
    // Init the plot objects
    this.vertices = {};
    this.tempVertices = {}; // Vertices are first xformed and stored in tempVertices set
    this.lines = {};
    this.classRules = {
        "pointDefault" : {rule:/^point\d+$/, className: "dataPoint"},
        "pointSelected": {rule:/^pointX$/  , className: "dataPointSelected"}
    }
    // Define the box vertices
    var cubeSize = 400;
    this.vertices.boxA = new Vertex3D( cubeSize, cubeSize, cubeSize);
    this.vertices.boxB = new Vertex3D(-cubeSize, cubeSize, cubeSize);
    this.vertices.boxC = new Vertex3D(-cubeSize,-cubeSize, cubeSize);
    this.vertices.boxD = new Vertex3D( cubeSize,-cubeSize, cubeSize);
    this.vertices.boxE = new Vertex3D( cubeSize, cubeSize,-cubeSize);
    this.vertices.boxF = new Vertex3D(-cubeSize, cubeSize,-cubeSize);
    this.vertices.boxG = new Vertex3D(-cubeSize,-cubeSize,-cubeSize);
    this.vertices.boxH = new Vertex3D( cubeSize,-cubeSize,-cubeSize);
    // Define the box lines
    this.lines.box_AB = {a:"boxA", b:"boxB"};
    this.lines.box_BC = {a:"boxB", b:"boxC"};
    this.lines.box_CD = {a:"boxC", b:"boxD"};
    this.lines.box_DA = {a:"boxD", b:"boxA"};
    this.lines.box_EF = {a:"boxE", b:"boxF"};
    this.lines.box_FG = {a:"boxF", b:"boxG"};
    this.lines.box_GH = {a:"boxG", b:"boxH"};
    this.lines.box_HE = {a:"boxH", b:"boxE"};
    this.lines.box_AE = {a:"boxA", b:"boxE"};
    this.lines.box_BF = {a:"boxB", b:"boxF"};
    this.lines.box_CG = {a:"boxC", b:"boxG"};
    this.lines.box_DH = {a:"boxD", b:"boxH"};
}
ViewBox3D.prototype.getClassSet = function(verticeId) {
    // Matches verticeId against regex rules, returns space-separated list of classes
    var classNames = [];
    for (var classRuleId in this.classRules) {
        var classRule = this.classRules[classRuleId];
        if (classRule.rule.test(verticeId)) classNames.push(classRule.className);
    }
    return classNames.length ? classNames.join(" ") : null;
}
ViewBox3D.prototype.xformVertex = function(vertexId) {
    // Return the vertex with all tranformations applied
    return this.rotateAxis ? this.vertices[vertexId].rotateV(this.rotateAxis, -Math.sqrt(this.rotateAxis.x*this.rotateAxis.x+this.rotateAxis.y*this.rotateAxis.y)*0.003) : this.vertices[vertexId];
    /*
    return this.vertices[vertexId]
        .rotateYZ(this.rotateYZ)
        .rotateZX(this.rotateZX)
        .rotateXY(this.rotateXY)
        .scale(this.scaleX, this.scaleY, this.scaleZ);
    */
}
ViewBox3D.prototype.getPerspectiveXY = function(vertex) {
    // Returns the screen xy for 3d point, looking from camera and applying the rotations
    return {
        x: this.focus * vertex.x / (this.camera.z - vertex.z),
        y: this.focus * vertex.y / (this.camera.z - vertex.z)
    }
}
ViewBox3D.prototype.draw = function() {
    // Draw the initial stage svg with its container
}
ViewBox3D.prototype.clickDataPoint = function(verticeId) {
    // Virtual method, meant to be overrided
    var dataPoint = this.dataSet[verticeId];
    console.log(dataPoint);
}
ViewBox3D.prototype.update = function() {
    // Update the stage svg
    var svgElement = document.getElementById("graphics");
    var svgContent = new SVGBuilder();
    this.tempVertices = {};
    if (plot.mode == "rotate") {
        /*
        // Debug: red line showing the rotation direction and distance
        svgContent.addLine({
            x1: this.localOffset.x,
            y1: this.localOffset.y,
            x2: this.localOffset.x + this.dragEnd.x - this.dragStart.x,
            y2: this.localOffset.y + this.dragEnd.y - this.dragStart.y,
            style: "stroke:rgb(255,0,0);stroke-width:2"
        });
        */
        // While the mouse-drag rotation is in progress, update the temp vertice set
        for (var verticeId in this.vertices) this.tempVertices[verticeId] = this.xformVertex(verticeId);
    } else {
        // No rotation mode, so no transformation
        this.tempVertices = this.vertices;
    }

    // Draw the points
    for (var verticeId in this.tempVertices) {
        if (!/^point\d+$/.test(verticeId)) continue;
        var vertice = this.tempVertices[verticeId];
        //<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
        var point = this.getPerspectiveXY(vertice);
        // TROUBLE AHEAD: the onclick attr refers to a variable named "plot", but it should refer to THIS plot object instance
        // The SVG building must be redone to deal with svg elements rather their textual representation. Then the events can be bound in JS.
        // Also: the only parameter passed should be "this". The verticeId must be saved in attrs and the event method will retrieve it from there.
        svgContent.addRect({
            x      : this.localOffset.x + point.x - 2,
            y      : this.localOffset.y + point.y - 2,
            width  : 5,
            height : 5,
            "class": this.getClassSet(verticeId),
            onclick: "plot.clickDataPoint(&quot;" + verticeId + "&quot;);"
        });
    }
    // Draw the cube and path lines
    var reLine = /^([^_]+)_([^_]+)(_\d+)?$/;
    for (var lineId in this.lines) {
        var line = this.lines[lineId];
        if (!line) {console.log(lineId, "bad line def."); continue;}
        var verticeA = this.tempVertices[line.a];
        var verticeB = this.tempVertices[line.b];
        if (!verticeA) {console.log(lineId, "bad verticeA", line); continue;}
        if (!verticeB) {console.log(lineId, "bad verticeB", line); continue;}
        var pointA = this.getPerspectiveXY(verticeA);
        var pointB = this.getPerspectiveXY(verticeB);
        var parseId = reLine.exec(lineId);
        svgContent.addLine({
            x1: this.localOffset.x + pointA.x,
            y1: this.localOffset.y + pointA.y,
            x2: this.localOffset.x + pointB.x,
            y2: this.localOffset.y + pointB.y,
            class: parseId[1] == "box" ? "plotBox" : "plotPath-" + parseId[2]
        });
    }
    svgElement.innerHTML = svgContent.draw();
}