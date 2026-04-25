//introduction

class Shape{
    constructor(color){
        this.color = color;
    }

    describe(){
        return `A shape of color ${this.color}`;
    }

    changeColor(newColor){
        this.color = newColor;
    }
}

class Circle extends Shape{
    constructor(color, radius){
        super(color); // dùng lại biến của class cha
        this.radius = radius;
    }

    describe(){
        const parentDescription = super.describe(); //gọi hàm ở class cha
        return `A ${this.color} circle with a radius of ${this.radius}`;
    }

    //một cách khác để dùng phương thức
    area(){
        return Math.PI * this.radius * this.radius;
    }

    // arrow function
    permimeter = () =>{
        return 2 * Math.PI * this.radius;
    }
}

class Retangle extends Shape{
    constructor(color, width, height){
        super(color);
        this.width = width;
        this.height = height;
    }

    describe(){
        return `A ${this.color} retangle of ${this.width} x ${this.height}`;
    }
}

const myCircle = new Circle("red", 5);
console.log(myCircle.describe());
myCircle.changeColor("blue");
console.log(myCircle.describe());