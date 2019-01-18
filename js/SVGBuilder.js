/*
SVGBuilder class helps to build a SVG document
TODO:
- new elements!
- introduce way how to add elements and keep their id so that they can be later removed by it
- introduce layers and object rearranging within layers (bring to the top, to the bottom, etc)
*/

function SVGBuilder() {
  this.document = document.createElementNS("http://www.w3.org/2000/svg", "svg");
}
SVGBuilder.prototype.addElement = function(elementName, attr, attrList, nodeValue) {
  var element = document.createElementNS("http://www.w3.org/2000/svg", elementName);
  attrList.forEach(function(attrName) {
    if (attrName in attr) {
      var attrValue = attr[attrName];
      if (attrValue === null) return;
      if (typeof(attrValue) === 'function') {
        element[attrName] = attrValue;
        return;
      }
      element.setAttribute(attrName, attrValue);
    }
    if (nodeValue !== undefined) element.innerHTML = nodeValue;
  });
  this.document.appendChild(element);
}
SVGBuilder.prototype.addLine = function(attr) {
  this.addElement("line", attr, ["x1", "y1", "x2", "y2", "style", "class"]);
}
SVGBuilder.prototype.addRect = function(attr) {
  this.addElement("rect", attr, ["x", "y", "width", "height", "style", "class", "onclick"]);
}
SVGBuilder.prototype.addCircle = function(attr) {
  this.addElement("circle", attr, ["cx", "cy", "r", "stroke", "stroke-width", "fill", "style", "class", "onclick"]);
}
SVGBuilder.prototype.addText = function(attr, value) {
  this.addElement("text", attr, ["x", "y", "fill", "style", "class", "onclick"], value);
}
SVGBuilder.prototype.insert = function(parent, wipe) {
  if (wipe) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  parent.appendChild(this.document);
}
