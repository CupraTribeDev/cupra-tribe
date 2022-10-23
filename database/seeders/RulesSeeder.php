<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rules;


class RulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Rules::factory()->create([
            'text' => '<h1>Vitiosum est enim in dividendo partem in genere numerare.</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ego vero isti, inquam, permitto. Id et fieri posse et saepe esse factum et ad voluptates percipiendas maxime pertinere. Virtutibus igitur rectissime mihi videris et ad consuetudinem nostrae orationis vitia posuisse contraria. Respondent extrema primis, media utrisque, omnia omnibus. Duo Reges: constructio interrete. Non autem hoc: igitur ne illud quidem. At ille pellit, qui permulcet sensum voluptate.</p>\n<blockquote>Eorum enim est haec querela, qui sibi cari sunt seseque diligunt.</blockquote>\n<ul>\n<li>Immo sit sane nihil melius, inquam-nondum enim id quaero-, num propterea idem voluptas est, quod, ut ita dicam, indolentia?</li>\n<li>Hic Speusippus, hic Xenocrates, hic eius auditor Polemo, cuius illa ipsa sessio fuit, quam videmus.</li>\n<li>Aliena dixit in physicis nec ea ipsa, quae tibi probarentur;</li>\n<li>Princeps huius civitatis Phalereus Demetrius cum patria pulsus esset iniuria, ad Ptolomaeum se regem Alexandream contulit.</li>\n<li>Qui si omnes veri erunt, ut Epicuri ratio docet, tum denique poterit aliquid cognosci et percipi.  Nihilo magis. Ego quoque, inquit, didicerim libentius si quid attuleris, quam te reprehenderim. Ita credo. Quo modo autem philosophus loquitur? Optime, inquam. Quid autem habent admirationis, cum prope accesseris?</li>\n</ul>\n<ol>\n<li>Quod autem magnum dolorem brevem, longinquum levem esse dicitis, id non intellego quale sit.</li>\n<li>Quae tamen a te agetur non melior, quam illae sunt, quas interdum optines.</li>\n<li>Nec mihi illud dixeris: Haec enim ipsa mihi sunt voluptati, et erant illa Torquatis.</li>\n<li>Nos paucis ad haec additis finem faciamus aliquando;</li>\n<li>Hosne igitur laudas et hanc eorum, inquam, sententiam sequi nos censes oportere?</li>\n<li>In motu et in statu corporis nihil inest, quod animadvertendum esse ipsa natura iudicet?</li>\n</ol>\n<p>Illis videtur, qui illud non dubitant bonum dicere -; Nihilo beatiorem esse Metellum quam Regulum. Quorum sine causa fieri nihil putandum est. <code>Nemo igitur esse beatus potest.</code> Qualem igitur hominem natura inchoavit? Multoque hoc melius nos veriusque quam Stoici.</p>\n\n<p>Si quicquam extra virtutem habeatur in bonis. <a href="http://loripsum.net/" target="_self">Traditur, inquit, ab Epicuro ratio neglegendi doloris.</a> An potest cupiditas finiri? Stuprata per vim Lucretia a regis filio testata civis se ipsa interemit. Sic enim censent, oportunitatis esse beate vivere. Sed ille, ut dixi, vitiose. Nunc agendum est subtilius. Multoque hoc melius nos veriusque quam Stoici. Tum Quintus: Est plane, Piso, ut dicis, inquit.</p>',
        ]);


    }
}
