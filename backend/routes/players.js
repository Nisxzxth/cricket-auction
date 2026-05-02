const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const XLSX = require('xlsx');

// GET all players
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      const num = parseInt(search);
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        ...(isNaN(num) ? [] : [{ playerNumber: num }])
      ];
    }
    if (status) query.status = status;

    const players = await Player.find(query).sort({ playerNumber: 1 });
    res.json({ success: true, data: players });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
    res.json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create player
router.post('/', async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json({ success: true, data: player });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH update player status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, soldPrice } = req.body;
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { status, soldPrice: status === 'Sold' ? soldPrice : 0 },
      { new: true }
    );
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
    res.json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
    res.json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE player
router.delete('/:id', async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST seed initial players
router.post('/seed/init', async (req, res) => {
  try {
    const samplePlayers = [
      { playerNumber: 1, name: 'Eben', basePrice: 200, proficiency: 'Batter', image: '/players/pic1.png', status: 'Unsold' },
      { playerNumber: 2, name: 'Suresh', basePrice: 500, proficiency: 'Batter', image: '/players/pic2.png', status: 'Unsold' },
      { playerNumber: 3, name: 'Augustin Aron Raja', basePrice: 200, proficiency: 'Batter', image: '/players/pic3.png', status: 'Unsold' },
      { playerNumber: 4, name: 'Dinesh C', basePrice: 200, proficiency: 'Batter', image: '/players/pic4.png', status: 'Unsold' },
      { playerNumber: 5, name: 'Rathina Rakesh', basePrice: 200, proficiency: 'Batter', image: '/players/pic5.png', status: 'Unsold' },
      { playerNumber: 6, name: 'Deepan', basePrice: 200, proficiency: 'Batter', image: '/players/pic6.png', status: 'Unsold' },
      { playerNumber: 7, name: 'Swaran T', basePrice: 200, proficiency: 'Batter', image: '/players/pic7.png', status: 'Unsold' },
      { playerNumber: 8, name: 'Akash', basePrice: 200, proficiency: 'Batter', image: '/players/pic8.png', status: 'Unsold' },
      { playerNumber: 9, name: 'Rahul Guru Prasath', basePrice: 200, proficiency: 'Batter', image: '/players/pic9.png', status: 'Unsold' },
      { playerNumber: 10, name: 'Jenson', basePrice: 200, proficiency: 'Bowler', image: '/players/pic10.png', status: 'Unsold' },
      { playerNumber: 11, name: 'Whyt', basePrice: 200, proficiency: 'Bowler', image: '/players/pic11.png', status: 'Unsold' },
      { playerNumber: 12, name: 'Vishnu KAP', basePrice: 200, proficiency: 'Bowler', image: '/players/pic12.png', status: 'Unsold' },
      { playerNumber: 13, name: 'Ibrahim', basePrice: 200, proficiency: 'Bowler', image: '/players/pic13.png', status: 'Unsold' },
      { playerNumber: 14, name: 'Alagu Mathish', basePrice: 200, proficiency: 'Bowler', image: '/players/pic14.png', status: 'Unsold' },
      { playerNumber: 15, name: 'Arul Murugan', basePrice: 200, proficiency: 'Bowler', image: '/players/pic15.png', status: 'Unsold' },
      { playerNumber: 16, name: 'Antony Vijay', basePrice: 200, proficiency: 'Bowler', image: '/players/pic16.png', status: 'Unsold' },
      { playerNumber: 17, name: 'Sam', basePrice: 200, proficiency: 'Bowler', image: '/players/pic17.png', status: 'Unsold' },
      { playerNumber: 18, name: 'John Raenis', basePrice: 200, proficiency: 'Bowler', image: '/players/pic18.png', status: 'Unsold' },
      { playerNumber: 19, name: 'Jabez Meshack', basePrice: 200, proficiency: 'Bowler', image: '/players/pic19.png', status: 'Unsold' },
      { playerNumber: 20, name: 'Icourt Durai', basePrice: 200, proficiency: 'Bowler', image: '/players/pic20.png', status: 'Unsold' },
      { playerNumber: 21, name: 'Prishi Kumar', basePrice: 200, proficiency: 'Bowler', image: '/players/pic21.png', status: 'Unsold' },
      { playerNumber: 22, name: 'Jose Victor', basePrice: 200, proficiency: 'Bowler', image: '/players/pic22.png', status: 'Unsold' },
      { playerNumber: 23, name: 'Akash', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic23.png', status: 'Unsold' },
      { playerNumber: 24, name: 'Aadhi', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic24.png', status: 'Unsold' },
      { playerNumber: 25, name: 'Mugi', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic25.png', status: 'Unsold' },
      { playerNumber: 26, name: 'Venkatesh', basePrice: 500, proficiency: 'All Rounder', image: '/players/pic26.png', status: 'Unsold' },
      { playerNumber: 27, name: 'Aron M Silva', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic27.png', status: 'Unsold' },
      { playerNumber: 28, name: 'Shawn Daniel', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic28.png', status: 'Unsold' },
      { playerNumber: 29, name: 'Kumaran', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic29.png', status: 'Unsold' },
      { playerNumber: 30, name: 'Surya', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic30.png', status: 'Unsold' },
      { playerNumber: 31, name: 'Joe Rithik', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic31.png', status: 'Unsold' },
      { playerNumber: 32, name: 'Saran', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic32.png', status: 'Unsold' },
      { playerNumber: 33, name: 'Suyamburaj', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic33.png', status: 'Unsold' },
      { playerNumber: 34, name: 'Sundar', basePrice: 500, proficiency: 'All Rounder', image: '/players/pic34.png', status: 'Unsold' },
      { playerNumber: 35, name: 'Sham Christon', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic35.png', status: 'Unsold' },
      { playerNumber: 36, name: 'Siva Sundar', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic36.png', status: 'Unsold' },
      { playerNumber: 37, name: 'Keerthi Nivas', basePrice: 500, proficiency: 'All Rounder', image: '/players/pic37.png', status: 'Unsold' },
      { playerNumber: 38, name: 'Anish', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic38.png', status: 'Unsold' },
      { playerNumber: 39, name: 'Silvester V', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic39.png', status: 'Unsold' },
      { playerNumber: 40, name: 'Mukesh', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic40.png', status: 'Unsold' },
      { playerNumber: 41, name: 'Samuel', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic41.png', status: 'Unsold' },
      { playerNumber: 42, name: 'Sabari S', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic42.png', status: 'Unsold' },
      { playerNumber: 43, name: 'Stokes Suthan', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic43.png', status: 'Unsold' },
      { playerNumber: 44, name: 'Sankar', basePrice: 500, proficiency: 'All Rounder', image: '/players/pic44.png', status: 'Unsold' },
      { playerNumber: 45, name: 'Sankar Sankar', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic45.png', status: 'Unsold' },
      { playerNumber: 46, name: 'Brucelee', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic46.png', status: 'Unsold' },
      { playerNumber: 47, name: 'Pappali', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic47.png', status: 'Unsold' },
      { playerNumber: 48, name: 'Vishal', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic48.png', status: 'Unsold' },
      { playerNumber: 49, name: 'Sam C', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic49.png', status: 'Unsold' },
      { playerNumber: 50, name: 'Nithish Joyal', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic50.png', status: 'Unsold' },
      { playerNumber: 51, name: 'Sogul Prasath', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic51.png', status: 'Unsold' },
      { playerNumber: 52, name: 'Arumugaraj Raj', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic52.png', status: 'Unsold' },
      { playerNumber: 53, name: 'Jegan', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic53.png', status: 'Unsold' },
      { playerNumber: 54, name: 'Kamalesh', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic54.png', status: 'Unsold' },
      { playerNumber: 55, name: 'Aatharsh Thangaraj', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic55.png', status: 'Unsold' },
      { playerNumber: 56, name: 'Pons', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic56.png', status: 'Unsold' },
      { playerNumber: 57, name: 'Red Mani', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic57.png', status: 'Unsold' },
      { playerNumber: 58, name: 'Kabee', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic58.png', status: 'Unsold' },
      { playerNumber: 59, name: 'Teo', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic59.png', status: 'Unsold' },
      { playerNumber: 60, name: 'Muthu Kumar', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic60.png', status: 'Unsold' },
      { playerNumber: 61, name: 'Vikram', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic61.png', status: 'Unsold' },
      { playerNumber: 62, name: 'Royston', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic62.png', status: 'Unsold' },
      { playerNumber: 63, name: 'Ajith M', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic63.png', status: 'Unsold' },
      { playerNumber: 64, name: 'Dharun', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic64.png', status: 'Unsold' },
      { playerNumber: 65, name: 'Sathyan S', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic65.png', status: 'Unsold' },
      { playerNumber: 66, name: 'Srimath', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic66.png', status: 'Unsold' },
      { playerNumber: 67, name: 'Sujan Peri Santhosh', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic67.png', status: 'Unsold' },
      { playerNumber: 68, name: 'Nagaraj', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic68.png', status: 'Unsold' },
      { playerNumber: 69, name: 'Santhana Raj', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic69.png', status: 'Unsold' },
      { playerNumber: 70, name: 'N V K', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic70.png', status: 'Unsold' },
      { playerNumber: 71, name: 'Murali RMD', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic71.png', status: 'Unsold' },
      { playerNumber: 72, name: 'Joe', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic72.png', status: 'Unsold' },
      { playerNumber: 73, name: 'Ponraj', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic73.png', status: 'Unsold' },
      { playerNumber: 74, name: 'Gowsic', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic74.png', status: 'Unsold' },
      { playerNumber: 75, name: 'Sankar', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic75.png', status: 'Unsold' },
      { playerNumber: 76, name: 'Rohith Fonseka', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic76.png', status: 'Unsold' },
      { playerNumber: 77, name: 'Nihil Soundar', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic77.png', status: 'Unsold' },
      { playerNumber: 78, name: 'Vignessh A', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic78.png', status: 'Unsold' },
      { playerNumber: 79, name: 'Maddy', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic79.png', status: 'Unsold' },
      // Uncapped Players (nos stats available)
      { playerNumber: 80, name: 'Poovarasan', basePrice: 200, proficiency: 'Batter', image: '/players/pic80.png', status: 'Unsold' },
      { playerNumber: 81, name: 'Marishkumar S', basePrice: 200, proficiency: 'Batter', image: '/players/pic81.png', status: 'Unsold' },
      { playerNumber: 82, name: 'Denish Raj', basePrice: 200, proficiency: 'Batter', image: '/players/pic82.png', status: 'Unsold' },
      { playerNumber: 83, name: 'Sarathkumar', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic83.png', status: 'Unsold' },
      { playerNumber: 84, name: 'Hari', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic84.png', status: 'Unsold' },
      { playerNumber: 85, name: 'Suthakar R', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic85.png', status: 'Unsold' },
      { playerNumber: 86, name: 'Mohamed Ziyaudeen', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic86.png', status: 'Unsold' },
      { playerNumber: 87, name: 'Franklin', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic87.png', status: 'Unsold' },
      { playerNumber: 88, name: 'Munies Priyan', basePrice: 500, proficiency: 'All Rounder', image: '/players/pic88.png', status: 'Unsold' },
      { playerNumber: 89, name: 'Daniel', basePrice: 500, proficiency: 'All Rounder', image: '/players/pic89.png', status: 'Unsold' },
      { playerNumber: 90, name: 'Sundhara Moorthy', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic90.png', status: 'Unsold' },
      { playerNumber: 91, name: 'Mohamed Hanifa', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic91.png', status: 'Unsold' },
      { playerNumber: 92, name: 'Sahul Hameed Ashik', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic92.png', status: 'Unsold' },
      { playerNumber: 93, name: 'Arjun', basePrice: 500, proficiency: 'All Rounder', image: '/players/pic93.png', status: 'Unsold' },
      { playerNumber: 94, name: 'Sharan', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic94.png', status: 'Unsold' },
      { playerNumber: 95, name: 'Riyaz', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic95.png', status: 'Unsold' },
      { playerNumber: 96, name: 'Elyas', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic96.png', status: 'Unsold' },
      { playerNumber: 97, name: 'Sidesh Ram', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic97.png', status: 'Unsold' },
      { playerNumber: 98, name: 'Mithun Mithran', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic98.png', status: 'Unsold' },
      { playerNumber: 99, name: 'Jack', basePrice: 200, proficiency: 'Bowler', image: '/players/pic99.png', status: 'Unsold' },
      { playerNumber: 100, name: 'Kiruthish M', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic100.png', status: 'Unsold' },
      { playerNumber: 101, name: 'Gangatharan', basePrice: 200, proficiency: 'All Rounder', image: '/players/pic101.png', status: 'Unsold' },
    ];
    const players = await Player.insertMany(samplePlayers, { ordered: false });
    res.json({ success: true, message: `${players.length} players seeded`, data: players });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// GET download excel
router.get('/export/excel', async (req, res) => {
  try {
    const soldPlayers = await Player.find({ status: 'Sold' }).sort({ playerNumber: 1 });
    const unsoldPlayers = await Player.find({ status: 'Unsold' }).sort({ playerNumber: 1 });

    const wb = XLSX.utils.book_new();

    const soldData = soldPlayers.map(p => ({
      'Player No': p.playerNumber,
      'Name': p.name,
      'Proficiency': p.proficiency,
      'Base Price': p.basePrice,
      'Sold Price': p.soldPrice || p.basePrice,
      'Status': p.status
    }));

    const unsoldData = unsoldPlayers.map(p => ({
      'Player No': p.playerNumber,
      'Name': p.name,
      'Proficiency': p.proficiency,
      'Base Price': p.basePrice,
      'Status': p.status
    }));

    const wsSold = XLSX.utils.json_to_sheet(soldData.length ? soldData : [{ 'Info': 'No sold players yet' }]);
    const wsUnsold = XLSX.utils.json_to_sheet(unsoldData.length ? unsoldData : [{ 'Info': 'No unsold players' }]);

    XLSX.utils.book_append_sheet(wb, wsSold, 'Sold Players');
    XLSX.utils.book_append_sheet(wb, wsUnsold, 'Unsold Players');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=NPM_T20_Trophy_Players.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
