import mongoose from "mongoose";

// format for weapons to store in database
const weaponFormat = new mongoose.Schema({
    characterId: { type: mongoose.Schema.Types.ObjectId, ref: "Character", required: true },
    weaponType: { type: String, required: true },
    weaponSkill: { type: String, required: true },
    singleShotDice: { type: Number, required: true },
    singleShotDamage: { type: Number, required: true },
    magazineSize: { type: Number, required: true },
    rateOfFire: { type: Number, required: true, default: 1 },
    concealable: { type: Boolean, required: true, default: false },
    ammunition: { type: String, default: "Basic Ammunition" },
    cost: { type: Number },
    weaponName: { type: String },
    weaponNotes: { type: String }
});

weaponFormat.pre("save", function(){
    if(this.weaponName == null || this.weaponName == "")
        this.weaponName = this.weaponType
});

export default mongoose.model("Weapon", weaponFormat);