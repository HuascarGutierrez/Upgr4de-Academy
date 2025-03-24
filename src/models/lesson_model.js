class LessonModel {
    constructor({
        id = "0",
        title = "No disponible",
        description = "No disponible",
        link_doc = "",
        link_video = "",
        number_lesson = 0,
        unit_id = "000"
    }) {
        this.id = id,
        this.title = title,
        this.description = description,
        this.link_doc = link_doc,
        this.link_video = link_video,
        this.number_lesson = number_lesson,
        this.unit_id = unit_id
    }

    static fromJson(data) {
        return new LessonModel({
            id: data.id,
            title: data.title,
            description: data.description,
            link_doc: data.link_doc,
            link_video: data.link_video,
            number_lesson: data.number_lesson,
            unit_id: data.unit_id
        })
    }
}

export default LessonModel;