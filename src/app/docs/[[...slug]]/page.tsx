import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { Icon } from '@iconify/react';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <footer className="mt-14 border-t border-fd-border/60 pt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`https://github.com/UmmItOS/www/blob/master/content/docs/${page.path}`}
          rel="noreferrer noopener"
          target="_blank"
          className="group inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          <Icon icon="mdi:github" className="w-4 h-4" />
          Found an issue? Edit this page
          <Icon
            icon="lucide:external-link"
            className="w-3.5 h-3.5 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-80"
          />
        </a>
        <div className="flex items-center gap-2.5 text-xs text-fd-muted-foreground">
          <a href="https://github.com/UmmItOS" target="_blank" rel="noopener noreferrer" className="hover:text-fd-foreground transition-colors">
            GitHub
          </a>
          <span className="h-1 w-1 rounded-full bg-fd-muted-foreground/40" />
          <a href="https://github.com/UmmItOS/UmmItOS/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-fd-foreground transition-colors">
            GPL-3.0
          </a>
          <span className="h-1 w-1 rounded-full bg-fd-muted-foreground/40" />
          <span>© {new Date().getFullYear()} UmmIt Kin</span>
        </div>
      </footer>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
