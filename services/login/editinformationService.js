const users = require('../../models/user');

exports.updateInformation = async (req, res) => {
  const { _id } = req.user;
  const { name:Name, 
          dob:DOB, 
          gender:Gender, 
          phno:Phno, 
          city:City, 
          about:About, 
          expectations:Expectations } = req.body;

	await users.updateOne({ _id },{
		Name, DOB, Gender, Phno, City, About, Expectations, Verified: true,
	});
	return res.redirect('/profile')
}