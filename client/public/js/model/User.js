export class User {
    constructor(name, email, gender, dob) {
        this.name = name;
        this.email = email;
        this.gender = gender;
        this.dob = dob;
        this.onChangeCallback = null;
    }

    setOnChangeCallback(callback) {
        this.onChangeCallback = callback;
    }

    update(newData) {
        let changed = false;
        for (const key in newData) {
            if (this[key] !== newData[key]) {
                this[key] = newData[key];
                changed = true;
            }
        }
        if (changed && this.onChangeCallback) {
            this.onChangeCallback(this);
        }
    }

    getProfile() {
        return {
            name: this.name,
            email: this.email,
            gender: this.gender,
            dob: this.dob
        };
    }
}