const express = require('express');
const router = express.Router();
const db = require('./db');

// Listar todas as clínicas
router.get('/clinics', (req, res) => {
  const sql = "SELECT * FROM clinics ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Cadastrar nova clínica
router.post('/clinics', (req, res) => {
  const { name, location, phone, specialty, description } = req.body;
  const sql = "INSERT INTO clinics (name, location, phone, specialty, description) VALUES (?, ?, ?, ?, ?)";
  
  db.query(sql, [name, location, phone, specialty, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, message: "Clínica cadastrada com sucesso!" });
  });
});

// Atualizar clínica existente
router.put('/clinics/:id', (req, res) => {
  const { id } = req.params;
  const { name, location, phone, specialty, description } = req.body;
  const sql = "UPDATE clinics SET name=?, location=?, phone=?, specialty=?, description=? WHERE id=?";
  
  db.query(sql, [name, location, phone, specialty, description, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Clínica atualizada!" });
  });
});

// Remover clínica
router.delete('/clinics/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM clinics WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Clínica removida!" });
  });
});

module.exports = router;