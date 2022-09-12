module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/posts/welcome',
        permanent: true,
      },
      {
        source: '/posts',
        destination: '/posts/welcome',
        permanent: true,
      },
    ]
  },
}
