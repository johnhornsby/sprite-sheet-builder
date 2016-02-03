export default class Rectangle {

	_scale = 1;

	_left = 0;

	_top = 0;

	_width = 0;

	_height = 0;


	constructor(left, top, width, height) {


		this._left = left || 0;
		this._top = top || 0;
		this._width = width || 0;
		this._height = height || 0;
	}

	get left() {
		return this._left;
	}

	get top() {
		return this._top;
	}

	get x() {
		return this._left;
	}

	get y() {
		return this._top;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get bottom() {
		return this._top + this._height;
	}

	get right() {
		return this._left + this._width;
	}

	set x(value) {
		this._left = value;
	}

	set y(value) {
		this._top = value;
	}

	set left(value) {
		this._left = value;
	}

	set top(value) {
		this._top = value;
	}

	set width(value) {
		this._width = value;
	}

	set height(value) {
		this._height = value;
	}

	set right(value) {
		this._width = value - this._left;
	}

	set bottom(value) {
		this._height = value - this._top;
	}


	contains(x, y) {
		if(x >= this._left && x < this._left + this._width && y >= this._top && y < this._top + this._height){
			return true;
		}
		return false;
	}


	containsRect(x, y, w, h) {
		if(x >= this._left && (x + w) <= this._left + this._width && y >= this._top && (y + h) <= this._top + this._height){
			return true;
		}
		return false;
	}


	union(toUnion) {
		const union = new Rectangle();
		union.left = Math.min(this._left, toUnion.left);
		union.top = Math.min(this._top, toUnion.top);
		union.width = Math.max(this._left + this._width, toUnion.left + toUnion.width) - union.left;
		union.height = Math.max(this._top + this._height, toUnion.top + toUnion.height) - union.top;
		return union;
	}


	toString() {
		return "Rectangle left:"+this._left+" top:"+this._top+" width:"+this._width+" height:"+this._height;	
	}

	applyScale(scale) {
		this._left *= scale;
		this._top *= scale;
		this._width *= scale;
		this._height *= scale;
	}

	static intersect(rect1, rect2) {
		const rectI = new Rectangle();
		rectI.left = Math.max(rect1.left, rect2.left);
		rectI.top = Math.max(rect1.top, rect2.top);
		rectI.right = Math.min(rect1.right, rect2.right);
		rectI.bottom = Math.min(rect1.bottom, rect2.bottom);
		return rectI;
	}


}