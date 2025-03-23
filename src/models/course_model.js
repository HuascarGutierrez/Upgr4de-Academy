class CourseModel {
    constructor({
        id = "0",
        title = "Sin título",
        description = "Sin descripción",
        link_image = "",
        category = "Desconocida",
        teacher = "No asignado",
        number_students = 0,
        creation_date = "0/0/0"
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.link_image = link_image;
        this.category = category;
        this.teacher = teacher;
        this.number_students = number_students;
        this.creation_date = creation_date;
    }

    // Método para poder crear una instancia desde un JSON
    static fromJson(data) {
        return new CourseModel({
            id: data.id,
            title: data.title,
            description: data.description,
            link_image: data.link_image,
            category: data.category,
            teacher: data.teacher,
            number_students: data.number_students,
            creation_date: data.creation_date
        });
    }
}

export default CourseModel;
