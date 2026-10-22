const express = require('express');
const path = require('path');
const apiApp = require('./api/index.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use('/api', apiApp);

// 生产环境提供静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
