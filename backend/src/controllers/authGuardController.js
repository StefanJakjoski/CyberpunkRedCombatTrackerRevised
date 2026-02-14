export const getProtectedData = (req, res) => {
    try{
        res.json({ 
            message: `Welcome, ${req.user.name}`,
            data: { email: req.user.email, role: req.user.role, id: req.user._id } 
        });
    }catch(err){
        console.err("Auth Guard Routing error:", err);
    }
};

export const getAdminData = (req, res) => {
    res.json({
        message: `Welcome to the admin panel, ${req.user.name}`,
        data: { email: req.user.email, role: req.user.role, id: req.user._id }
    });
};