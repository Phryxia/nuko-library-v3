import { GetStaticProps } from 'next'

export default function Home() {
  return null
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    redirect: {
      destination: '/welcome',
      permanent: true,
    },
  }
}
