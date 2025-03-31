class UnitModel {
    constructor({
        id = "0",
        course_id = "000",
        description = "No disponible",
        number_unit = 0,
        title = "No disponible"
    }) {
        this.id = id;
        this.course_id = course_id;
        this.description = description;
        this.number_unit = number_unit;
        this.title = title
    }

    static fromJson(data) {
        return new UnitModel({
            id: data.id,
            course_id: data.course_id,
            description: data.description,
            number_unit: data.number_unit,
            title: data.title
        })
    }
}

export default UnitModel;