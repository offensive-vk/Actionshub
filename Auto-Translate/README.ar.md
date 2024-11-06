# ترجمة تلقائية 📘

قم بترجمة ملف Markdown تلقائيًا (على سبيل المثال، README.md) إلى لغات أخرى وأرسل النسخة المترجمة مرة أخرى إلى مستودعك.

## الترجمة الحالية

[لا](./README.hi.md)-[فرنسي](./README.fr.md)-[عربي](./README.ar.md)-[الصينية](./README.zh-CN.md)-[اسبانيول](./README.es.md)-

## 📖 نظرة عامة

**ترجمة تلقائية**هو إجراء GitHub يستخدم ترجمة Google لإنشاء نسخ مترجمة من ملفات Markdown في مستودعك. وهذا مفيد بشكل خاص للمستودعات ذات الجمهور العالمي، مما يجعل الوثائق متاحة بلغات متعددة.

## ✨ المميزات

-   يترجم ملفات Markdown إلى أي لغة محددة.
-   يرسل الملف المترجم إلى المستودع.
-   رسالة التزام قابلة للتكوين، وملتزم، وخيارات التزام إضافية.

## 🚀 الاستخدام

لإجراء اختبار إطلاق النار المباشر، من فضلك انقر[هنا](https://github.com/offensive-vk/auto-translate/tree/master/.github/workflows/test.yml)لنرى مثالا مثاليا لهذا الإجراء.

أضف ما يلي إلى الخاص بك`.github/workflows/translate.yml`ملف سير العمل لإعداد**ترجمة تلقائية**في مستودعك:

```yaml
name: Translate Action
on:
  push:
    branches:
      - main

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Auto Translate
        uses: offensive-vk/auto-translate-action@master
        with:
          file: 'README.md'
          language: 'es'

      - name: Commit and Push
        uses: offensive-vk/auto-commit-push@v7
        with: 
          branch: 'master'
          name: 'TheHamsterBot'
          email: 'TheHamsterBot@outlook.com'
          github-token: ${{ secrets.BOT_TOKEN }}
          message: 'CI: Translated Markdown Files.'
```

هذا المثال يترجم`README.md`ملف إلى الإسبانية (`es`) والملف المترجم`README.es.md`إلى المستودع.

### المدخلات

| اسم الإدخال      | وصف                                                                                    | مطلوب | تقصير                                                                |
| ---------------- | -------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------- |
| `file`           | مسار الملف المراد ترجمته (بالنسبة إلى جذر المستودع).                                   | لا    | `README.md`                                                          |
| `repo-token`     | يستخدم رمز GitHub لمصادقة الالتزامات. يستخدم`${{ secrets.GITHUB_TOKEN }}`في سير العمل. | لا    |                                                                      |
| `committer`      | اسم الملتزم بالالتزام.                                                                 | لا    | `github-actions[bot] <github-actions[bot]@users.noreply.github.com>` |
| `commit-options` | خيارات إضافية لل`git commit`يأمر.                                                      | لا    |                                                                      |
| `language`       | رمز اللغة الهدف للترجمة (على سبيل المثال،`es`,`zh-CN`,`fr`).                           | لا    | `es`                                                                 |

### مثال لسير العمل

```yaml
name: Translate Multilingual Readme
on:
  workflow_dispatch:

jobs:
  translate:
    strategy:
      matrix:
        lang: ['es', 'hi', 'fr', 'zh-CN', 'ar']
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Auto Translate README to French
        uses: offensive-vk/auto-translate@master
        with:
          file: 'README.md'
          language: ${{ matrix.lang }}

      - name: Commit and Push
        uses: offensive-vk/auto-commit-push@v7
        with: 
          branch: 'master'
          name: 'TheHamsterBot'
          email: 'TheHamsterBot@outlook.com'
          github-token: ${{ secrets.BOT_TOKEN }}
          message: 'Translated Markdown ${{ matrix.lang }} File.'
```

## ⚙️ اللغات المدعومة

استخدم أي رمز لغة تدعمه خدمة الترجمة من Google (على سبيل المثال،`es`للإسبانية،`zh-CN`للصينية المبسطة،`fr`للفرنسية). للحصول على القائمة الكاملة، انظر[رموز لغة ترجمة جوجل](https://cloud.google.com/translate/docs/languages).

## 🛠 التطوير

إذا كنت تريد إنشاء الإجراء واختباره محليًا، فيمكنك استخدامه[يمثل](https://github.com/nektos/act)لتشغيل إجراءات GitHub في بيئتك المحلية.

```bash
# Install dependencies
pnpm i

# Run action locally
act -j translate
```

## 📝 ملاحظات

-   تأكد من إضافة صالح`github-token`في سير العمل الخاص بك لمصادقة الالتزام.
-   تعتمد جودة الترجمة على خدمة الترجمة من Google وقد تختلف باختلاف اللغة.

## 🤝 المساهمة

المساهمات هي موضع ترحيب! لا تتردد في إرسال المشكلات أو طلبات الميزات أو طلبات السحب.

## 🧑‍💻 المؤلف

تم إنشاؤها بواسطة فيدانش ([هجوم vk](https://github.com/offensive-vk)).

## 📜 الترخيص

هذا المشروع مرخص بموجب ترخيص MIT.
