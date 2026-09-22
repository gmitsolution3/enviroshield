import { Footer, Header, PageHero, Reveal, SectionHeader } from '@/components/shared';
import { StaggerContainer, StaggerItem } from '@/components/animations/reveal';
import { blogPosts } from '@/lib/data/content';

export const metadata = { title: 'Journal | Enviroshield ideas and inspiration', description: 'Ideas, guides, and inspiration for better walls and better spaces from the Enviroshield team.' };

export default function BlogPage() {
  const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="JOURNAL" title="Ideas, guides and inspiration for better spaces." text="Practical advice and thoughtful ideas from our team — from choosing a colour to preparing a wall properly." image="https://images.pexels.com/photos/7546558/pexels-photo-7546558.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600" />
        <section className="section">
          <div className="container">
            <SectionHeader eyebrow="ALL ARTICLES" title="Latest from the journal" />
            <div className="catalog-layout" style={{ marginTop: 44 }}>
              <Reveal dir="left">
                <aside>
                  <p className="filter-title">Categories</p>
                  <div className="filter-list" id="blog-filter">
                    {categories.map((cat) => <button key={cat} data-category={cat} className={cat === 'All' ? 'active' : ''}>{cat}</button>)}
                  </div>
                </aside>
              </Reveal>
              <StaggerContainer className="blog-grid" id="blog-grid">
                {blogPosts.map((post) => (
                  <StaggerItem key={post.slug} data-category={post.category} className="blog-card">
                    <div className="blog-image"><img src={post.image} alt={post.title} /></div>
                    <div className="blog-meta"><span>{post.category}</span><span>{post.date}</span></div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <a className="text-link" href={`/blog/${post.slug}`}>Read article</a>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
