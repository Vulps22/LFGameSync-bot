module.exports = {
    apps: [
      {
        name: 'LFGameSync',
        script: 'npm',
        args: 'start',
        cwd: '/var/gamesync-bot',
        watch: false,
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  };
  