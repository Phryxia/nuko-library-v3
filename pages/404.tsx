import { GetStaticProps } from 'next'

export default function Custom404() {
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
