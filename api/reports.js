const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const statsSql = 'SELECT key, value FROM report_stats ORDER BY id';
    const programsSql = 'SELECT program, students, pct FROM report_programs ORDER BY id';
    const pipelineSql = 'SELECT label, count, color FROM report_pipeline ORDER BY id';
    
    const [stats, programs, pipeline] = await Promise.all([
      db.allAsync(statsSql, []),
      db.allAsync(programsSql, []),
      db.allAsync(pipelineSql, [])
    ]);
    
    const statsObj = (stats || []).reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});
    
    res.json({ 
      reports: {
        stats: statsObj,
        programs: programs || [],
        pipeline: pipeline || [],
        agentPerformance: []
      }
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
