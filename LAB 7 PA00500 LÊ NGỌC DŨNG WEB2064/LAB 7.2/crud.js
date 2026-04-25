//hàm thêm sản phẩm
export function addItem(list, item){
    list.push(item);
    console.log("✅ Thêm thành công:", item);
}

//hàm cập nhật sản phẩm
export function updateItem(list, id, newData){
    const index = list.findIndex(i => i.id === id);
    if(index === -1){
        console.log("Không tìm thấy sản phẩm để xoá với id :",id);
        return;
    }
    Object.assign(list[index], newData); //sử dụng để cập nhật các giá trị trong object cũ
    console.log("✏️ Cập nhật thành công:", list[index]);
}

//hàm xoá sản phẩm
export function deleteItem(list, id){
    const index = list.findIndex(i => i.id === id);
    if(index === -1){
        console.log("Không tìm thấy sản phẩm để xoá với id :",id);
        return;
    }
    const removed = list.splice(index, 1);
    console.log("🗑️ Đã xoá:", removed[0]);
}

//hàm hiển thị sản phẩm
export function showList(list){
    list.forEach(item => console.log(item.showInfo()));
}