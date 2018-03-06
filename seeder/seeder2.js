const mongoose = require('mongoose');
const Post = require('../models/blog');
mongoose.connect('mongodb://localhost:27017/techblog')

const Posts = [
    new Post({
        title: 'Information-Technology in a close up',
        description: 'lorem ipsum  dolor sit amet consectetur adipisicing elit.',
        blog: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus et quo ullam repellendus nostrum aperiam repudiandae, voluptatum alias id? Rerum error saepe maxime officia pariatur libero dolores fuga exercitationem recusandae!
         Accusamus necessitatibus voluptate eaque, ipsa neque repudiandae minus laborum! Quas aliquid et nam voluptate asperiores officia nisi. Consequatur, repellat! Eos, modi id sapiente necessitatibus odio quibusdam in culpa eum inventore.
        Architecto commodi labore quasi voluptatibus, reiciendis ducimus earum. Itaque, mollitia dolores blanditiis natus doloremque sint quasi! Reprehenderit, soluta repudiandae? Porro officiis exercitationem hic minima ex nulla iste vel, accusantium quae.
        Voluptates ea soluta labore veritatis laudantium quod perspiciatis iste enim neque ipsa, id earum eos dolorem eius rem! Iure recusandae qui voluptatibus ipsa esse sed ratione asperiores tenetur ex enim.
        Sed laudantium inventore, quos blanditiis illo error repudiandae ipsam. Cumque eaque earum praesentium, sequi distinctio labore dignissimos blanditiis ipsum. Laudantium repellat cum vel amet sunt quam sint doloribus sequi eius.
        Labore repellat delectus provident atque totam ad consequuntur dignissimos, unde libero eveniet reprehenderit nesciunt? Praesentium tempora architecto enim, iure quae quasi. Corporis et eligendi sed esse velit facere quaerat accusamus!
        Enim, et. Totam dignissimos necessitatibus impedit odit nemo, eos illo explicabo debitis praesentium eum sed deleniti ullam repellat. Qui cumque quos hic in libero quae fugit repellendus illum impedit quasi.
        Labore illum officia ratione, voluptas non id odit velit, quidem reiciendis aperiam nam natus harum? Delectus illo, vel neque suscipit dolor dolores provident ipsa debitis hic, ex magni possimus temporibus!
        Eos modi non possimus mollitia doloribus at qui aperiam, suscipit, ut quaerat enim corporis rerum beatae esse magnam iure ad sapiente, nihil vel eaque nisi? Explicabo sunt repudiandae unde id.
        Voluptatem similique hic doloribus voluptate dolorum minus, dicta sunt et aliquid libero veritatis, ex quae quas, dignissimos consequuntur impedit commodi atque facere vero vel itaque? In dolor deleniti excepturi totam.
        Impedit et enim quam architecto qui deleniti ex, dignissimos alias, voluptates animi sapiente. Laudantium cumque neque animi quibusdam doloribus doloremque harum distinctio. Aut, perferendis unde. Quod harum architecto porro quidem.
        Commodi, saepe! Aliquid atque ipsa quae quam voluptatibus fuga quo, incidunt repellat odit magnam debitis beatae, tempore hic excepturi, nobis earum sapiente quas corrupti. Culpa et dolores repellat praesentium sed!
        Architecto inventore deserunt saepe aut nulla, eaque quaerat atque suscipit alias ipsa recusandae. Aliquam nulla eius temporibus asperiores, veniam voluptatum voluptatem officiis qui laboriosam, necessitatibus molestiae nam quasi nobis reprehenderit?
        Obcaecati modi minus est quibusdam officiis animi quas nisi! Iste reiciendis dolorum id! Doloremque placeat nostrum, deleniti, ea iusto minima omnis dolore est recusandae ullam voluptatem nemo molestiae non quam.
        Odit, consequatur harum. Possimus adipisci quisquam, praesentium facere sunt voluptatum dolores? Aut, minus officia doloribus provident, vero sed asperiores numquam accusantium laboriosam consequuntur debitis alias non eligendi modi aperiam sint.
        Ullam accusantium nisi voluptate earum neque, maiores dolorem! Quisquam mollitia, dolorum totam blanditiis officiis amet vero at obcaecati eaque laudantium debitis? Sed dolore perferendis voluptates sequi nesciunt architecto/! Rem, dicta.`,
        image: '/images/it.jpg'
    }),










];

var done = 0;

for (let i = 0; i < Posts.length; i++) {
    done++;
    Posts[i].save((err, Posted) => {
        if (err) {
            console.log(err)
        }
        if (done === Posts.length) {
            mongoose.disconnect();
        }

    })
}