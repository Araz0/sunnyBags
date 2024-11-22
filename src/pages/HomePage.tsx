import { memo } from 'react'
import { PageContainer } from '../components'

const HomePageRaw = () => {
  return (
    <PageContainer>
      <hero>
        <h1>Hero Title</h1>
      </hero>
      <section>
        <post>
          <h2>Post Title</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Pellentesque
            lacinia, eros ut vehicula varius, purus nisl interdum turpis, sed
            vestibulum ex odio ut quam.
          </p>
          <thumbnail>
            <img src="" alt="" srcset="" />
          </thumbnail>
        </post>
        <post>
          <h2>Post Title 2</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Pellentesque
            lacinia, eros ut vehicula varius, purus nisl interdum turpis, sed
            vestibulum ex odio ut quam.
          </p>
          <thumbnail>
            <img src="" alt="" srcset="" />
          </thumbnail>
        </post>
      </section>
      <randomBags></randomBags>
    </PageContainer>
  )
}

export const HomePage = memo(HomePageRaw)
