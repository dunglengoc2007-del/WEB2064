//user.js
export class User{
    constructor(id, name, email, role = "user"){
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    showInfo(){
        return `ID: ${this.id}, name: ${this.name}, email: ${this.email}, Quyền: ${this.role}`;
    }
}