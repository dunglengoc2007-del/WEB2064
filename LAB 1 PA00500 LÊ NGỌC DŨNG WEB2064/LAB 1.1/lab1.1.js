//hàm tính diện tích hình chữ nhật
const caculateArea = function(width, height){
    return width * height;
}

let result = caculateArea(5, 10);
console.log("Area of retangle: ",result);

//hàm tính tổng có kiểm tra số lượng đối số
function sumExactlyThreeNumbers(a,b,c){
    if(a === undefined || b === undefined || c === undefined){
        throw new Error("Exactly three arguments are required");
    }

    return a + b + c;
}

let result_sumExactlyThreeNumbers = sumExactlyThreeNumbers(1,2,3);
console.log("Sum ExactlyThreeNumbers is: ",result_sumExactlyThreeNumbers);

