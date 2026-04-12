import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://www.examifyr.com';
    const now = new Date();

    return [
        { url: base,                                                    lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
        { url: `${base}/python-readiness-test`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${base}/javascript-quiz`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${base}/sql-practice-test`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${base}/html-css-quiz`,                                 lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${base}/blog`,                                          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
        { url: `${base}/blog/python-concepts-before-exam`,              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/blog/sql-join-mistakes`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/blog/javascript-es6-interview`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/blog/css-flexbox-vs-grid`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ];
}
