import bcrypt from 'bcrypt'

    const createHash = async (password) => {
        const saltRounds = 10;
        try {
          const hash = await bcrypt.hash(password, saltRounds);
          return hash;
        } catch (err) {
          console.log("error:", err);
          throw new Error('failed to hash');
        }
      };
export default createHash