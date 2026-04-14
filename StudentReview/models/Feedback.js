const db = require('../config/database');

const DIFFICULTY_OPTIONS = ['very_easy', 'easy', 'moderate', 'challenging', 'very_challenging'];
const RECOMMEND_OPTIONS = ['yes', 'no', 'maybe'];

class Feedback {
    static validate({ rating, difficulty, enjoyed, improve, recommend }) {
        const errors = [];
        if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5)
            errors.push('Rating must be a whole number between 1 and 5.');
        if (!DIFFICULTY_OPTIONS.includes(difficulty))
            errors.push('Invalid difficulty value.');
        if (!enjoyed || enjoyed.trim().length < 10)
            errors.push('"Enjoyed" response must be at least 10 characters.');
        if (enjoyed && enjoyed.trim().length > 1000)
            errors.push('"Enjoyed" response must be under 1 000 characters.');
        if (!improve || improve.trim().length < 10)
            errors.push('"Improve" response must be at least 10 characters.');
        if (improve && improve.trim().length > 1000)
            errors.push('"Improve" response must be under 1 000 characters.');
        if (!RECOMMEND_OPTIONS.includes(recommend))
            errors.push('Invalid recommendation value.');
        return errors;
    }

    static async create({ course_id, student_id, rating, difficulty, enjoyed, improve, recommend }) {
        const sql = `
      INSERT INTO feedback (course_id, student_id, rating, difficulty, enjoyed, improve, recommend)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`;
        const { rows } = await db.query(sql, [course_id, student_id, rating, difficulty,
            enjoyed.trim(), improve.trim(), recommend]);
        return rows[0];
    }

    static async findByCourse(course_id) {
        const sql = `
      SELECT f.*, u.name AS student_name
      FROM   feedback f
      JOIN   users    u ON u.id = f.student_id
      WHERE  f.course_id = $1
      ORDER  BY f.created_at DESC`;
        const { rows } = await db.query(sql, [course_id]);
        return rows;
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM feedback WHERE id=$1', [id]);
        return rows[0] || null;
    }

    static async averageRating(course_id) {
        const sql = `SELECT ROUND(AVG(rating)::numeric, 1) AS avg FROM feedback WHERE course_id=$1`;
        const { rows } = await db.query(sql, [course_id]);
        return rows[0].avg;
    }

    static async ratingDistribution(course_id) {
        const sql = `
      SELECT rating, COUNT(*) AS count
      FROM   feedback
      WHERE  course_id = $1
      GROUP  BY rating
      ORDER  BY rating DESC`;
        const { rows } = await db.query(sql, [course_id]);
        return rows;
    }

    static async alreadySubmitted(course_id, student_id) {
        const sql = `SELECT 1 FROM feedback WHERE course_id=$1 AND student_id=$2`;
        const { rows } = await db.query(sql, [course_id, student_id]);
        return rows.length > 0;
    }

    static async delete(id) {
        await db.query('DELETE FROM feedback WHERE id=$1', [id]);
    }
}

module.exports = Feedback; 