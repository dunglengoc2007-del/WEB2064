import _ from "lodash";
import dayjs from "dayjs";

const users = [
  { name: "An", age: 20 },
  { name: "Bình", age: 22 },
  { name: "An", age: 20 },
];

// Loại bỏ các phần tử trùng lặp
const uniqueUsers = _.uniqWith(users, _.isEqual);

console.log("Unique users:", uniqueUsers);

// Hiển thị thời gian hiện tại
console.log("Current time:", dayjs().format("DD/MM/YYYY HH:mm:ss"));

// === THÊM CÁC VÍ DỤ MỞ RỘNG (Làm dài thêm code) ===

// 1. Thêm ví dụ Lodash: Nhóm dữ liệu (groupBy) và Sắp xếp (orderBy)
const moreUsers = [
  ...uniqueUsers,
  { name: "Cường", age: 25 },
  { name: "Dương", age: 20 },
];
// Nhóm users theo độ tuổi
const usersByAge = _.groupBy(moreUsers, 'age');
console.log("\nUsers grouped by age:", usersByAge);

// Sắp xếp users theo độ tuổi giảm dần, tên tăng dần
const sortedUsers = _.orderBy(moreUsers, ['age', 'name'], ['desc', 'asc']);
console.log("\nUsers sorted by age(desc) and name(asc):", sortedUsers);

// 2. Thêm ví dụ Dayjs: Tính toán ngày tháng
const now = dayjs();
console.log("\n--- Dayjs Examples ---");
console.log("Ngày mai sẽ là:", now.add(1, 'day').format("DD/MM/YYYY"));
console.log("Tuần trước là:", now.subtract(1, 'week').format("DD/MM/YYYY"));
console.log("Đầu tháng này là:", now.startOf('month').format("DD/MM/YYYY"));
console.log("Cuối năm nay là:", now.endOf('year').format("DD/MM/YYYY"));

// Khảng cách giữa 2 ngày (Difference)
const targetDate = dayjs("2026-12-31");
console.log(`Số ngày từ giờ đến hết năm 2026: ${targetDate.diff(now, 'day')} ngày`);
