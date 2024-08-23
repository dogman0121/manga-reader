class Comment{
    constructor(comment){
        this.id = comment.id;
        this.user_id = comment.user_id;
        this.text = comment.text;
        this.date = comment.date;
    }

    render(){
        return 0;
    }
}

let a = {
    id: 1,
    user_id: 1,
    text: "Абоба",
    date: "19092023",
};

let b = new Comment(a);
console.log(b);