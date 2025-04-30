class TeacherModel {
    constructor({
        id = "000",
        activo = true,
        createdAt = "",
        email = "",
        imageUrl = "",
        teacherName = "No disponible"
    }) {
        this.id = id,
        this.activo = activo,
        this.createdAt = createdAt,
        this.email = email,
        this.imageUrl = imageUrl,
        this.teacherName = teacherName
    }

    static fromJson(data) {
        return new TeacherModel({
            id: data.id,
            activo: data.activo,
            createdAt: data.createdAt,
            email: data.email,
            imageUrl: data.imageUrl,
            teacherName: data.teacherName
        })
    }
}