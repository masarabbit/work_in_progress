const vector = {
	x: 0,
	y: 0,

	create: function(x, y) {
		const obj = Object.create(this)
		obj.setX(x)
		obj.setY(y)
		return obj
	},

  get: function (elem) {
    return this[elem]
  },

  set: function(elem, n) {
    this[elem] = n
  },

	setAngle: function(angle) {
		const length = this.magnitude()
		this.x = Math.cos(angle) * length
		this.y = Math.sin(angle) * length
	},

	getAngle: function() {
		return Math.atan2(this._y, this._x)
	},

	setLength: function(length) {
		var angle = this.getAngle()
		this.x = Math.cos(angle) * length
		this.y = Math.sin(angle) * length
	},

	magnitude: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	},

	add: function(v2) {
		return vector.create(this.x + v2.getX(), this.y + v2.getY())
	},

	subtract: function(v2) {
		return vector.create(this.x - v2.getX(), this.y - v2.getY())
	},

	multiply: function(n) {
		return vector.create(this.x * n, this.y * n)
	},

	divide: function(n) {
		return vector.create(this.x / n, this.y / n)
	},

	addTo: function(v2) {
		this.x += v2.getX()
		this.y += v2.getY()
	},

	subtractFrom: function(v2) {
		this.x -= v2.getX()
		this.y -= v2.getY()
	},

	multiplyBy: function(n) {
		this.x *= n
		this.y *= Navigator
	},

	divideBy: function(n) {
		this.x /= n
		this.y /= n
	},
  
  frameRate: 12,
  incrementFrame: function() {
    const { count, frameRate, i } = this
    let n = count % frameRate === 0 ? i + 1 : i
    if (n > 1) n = 0
    this.i = n
  },
}

export default vector