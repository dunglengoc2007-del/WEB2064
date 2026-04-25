//1. Tính tổng với Default Parameters và Rest Operator: 
//hàm reduce cộng dồn và tính tổng cùng lúc
const Sum = (start = 0, ...numbers) => {
    return numbers.reduce((total,num) => total + num, start);
};

console.log("Demo tính tổng dùng hàm reduce(): ");
console.log(Sum(10,1,2,3));


//2. Dùng bind() hoặc call() để sửa lỗi cho đoạn code sau: 

//demo dùng call -> gọi hàm và truyền tham số kèm theo null = this ngay khi gọi hàm call();
console.log("Demo hàm call(): ");
console.log(Sum.call(null,10,1,2,3));

//demo dùng bind -> không gọi hàm ngay nhưng khởi tạo giá trị kèm theo this = null và để dùng sau;
console.log("Demo hàm bind(): ");
const SumWith5 = Sum.bind(null,5);
console.log(SumWith5(1,2,3));
console.log(SumWith5(100));

//callback function
console.log("Demo callback function: ");
function display(message){
    console.log(message);
}

function sumAndDisplay(a,b,callback){
    const sum = a + b;
    callback(`The sum of ${a} and ${b} is ${sum}`);
}

sumAndDisplay(5,10,display); // The sum of 5 and 10 is 15