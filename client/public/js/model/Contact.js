export class Contact {
    constructor(id, name, phone, email) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.onChangeCallback = null;
        return this.initOnModelChange();
    }

    initOnModelChange() {
        let handler = {
            set: (obj, prop, val) => {
                obj[prop] = val;
                if (this.onChangeCallback) {
                    this.onChangeCallback(this);
                }
                return true;
            }
        };
        return new Proxy(this, handler);
    }

    setOnChangeCallback(callback) {
        this.onChangeCallback = callback;
    }
}