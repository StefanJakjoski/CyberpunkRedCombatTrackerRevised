import mongoose from "mongoose";

// format for users to store in database
const characterFormat = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weapons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Weapon" }],
    name: { type: String },
    health: {type: Number},
    armor: { type: Number },
    headArmor: { type: Number },
    initiative: { type: Number },
});

characterFormat.pre("save", function(){
    if(!this.name)
        this.name = 'Gonk';

    if(this.health == null)
        this.health = Math.floor(Math.random()*30 + 20);

    if(this.armor == null)
        this.armor = Math.floor(Math.random()*4 + 7);

    if(this.headArmor == null)
        this.headArmor = 0;

    if(this.initiative == null)
        this.initiative = Math.floor(Math.random()*17 + 3);

    //next();
});

export default mongoose.model("Character", characterFormat);