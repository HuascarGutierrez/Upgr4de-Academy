class CourseModel {
    constructor({ id, title, description, lessons, quiz, teacher }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.lessons = lessons;
        this.quiz = quiz;
        this.teacher = teacher
    }
}


export default CourseModel

