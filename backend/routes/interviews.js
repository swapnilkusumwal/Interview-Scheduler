var express = require("express");
const Interviews = require("../models/interviews");
var router = express.Router();
const UserInterviews = require("../models/userInterviews");
var moment=require('moment');
// console.log(moment)
/* GET users listing. */
var smtp = require("../smtp");

let mailOptions = {
  from: mailerConfig.auth.user,
  subject: "Interview Schedule",
};
router.get("/", (req, res, next) => {
  Interviews.find({startTime:{$gte:new Date()}}).then((data) => {
    let result = data.map((a) => a._id.toString());
    UserInterviews.find({ interview: { $in: result } })
      .populate("email")
      .populate("interview")
      .then((result) => {
        // console.log(result);
        var reply = [];
        let hash_map = {};
        let k = 0;
        for (let i = 0; i < result.length; i++) {
          if (hash_map[result[i].interview._id] === undefined) {
            hash_map[result[i].interview._id] = k;
            k++;
            reply.push({
              _id: result[i].interview._id,
              startTime: result[i].interview.startTime,
              endTime: result[i].interview.endTime,
              interviewer: [],
              interviewee: [],
            });
          }

          if (result[i].role) {
            reply[hash_map[result[i].interview._id]].interviewer.push(
              result[i].email
            );
            // console.log(reply,"THIS");
          } else {
            // console.log("THERE");
            reply[hash_map[result[i].interview._id]].interviewee.push(
              result[i].email
            );
            // console.log(reply,"That");
          }
        }
        // console.log(result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({interviews:reply});
        res.end();
      })
      .catch((err) => {
        res.statusCode=400;
        res.setHeader("Content-Type", "application/json");
        res.json("Failed to fetch interview list.");
        res.end();
      });
  });
});

router.post("/", function (req, res, next) {
  console.log("STILL HERE");
  if (req.body.selectedCandidates.length < 2) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 400;
    res.json("Select atleast 2 candidates.")
    res.end();
    return;
  }
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;
  Interviews.find({
    $or: [
      {
        $and: [
          { startTime: { $gte: startTime } },
          { startTime: { $lte: endTime } },
        ],
      },
      {
        $and: [
          { startTime: { $lte: startTime } },
          { endTime: { $lte: endTime } },
          { endTime: { $gte: startTime } },
        ],
      },
      {
        $and: [
          { endTime: { $gte: startTime } },
          { endTime: { $lte: endTime } },
        ],
      },
    ],
  })
    .then(
      async (data) => {
        let result = [];
        if (data.length) {
          result = data.map((a) => a._id.toString());
          // console.log(result);
          await UserInterviews.find({
            $and: [
              { interview: { $in: result } },
              { email: { $in: req.body.selectedCandidates } },
            ],
          })
            .then(
              async (data) => {
                if (data.length > 0) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.json("Conflicting Interviews");
                  res.end();
                } else {
                  await Interviews.create({
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                  })
                    .then((data) => {
                      return data._id;
                    })
                    .then(
                      async (id) => {
                        let insertionArray = [];
                        let selectedCandidates = req.body.selectedCandidates,
                          selectedInterviewers = req.body.selectedInterviewers;
                        // console.log(req.body.selectedCandidates,"ASDSADASDAS");
                        let selectedCandidatesEmail =
                          req.body.selectedCandidatesEmail;

                        for (let i = 0; i < selectedCandidates.length; i++) {
                          let obj = {
                            email: selectedCandidates[i],
                            interview: id,
                          };
                          mailOptions.to = selectedCandidatesEmail[i];
                          mailOptions.html =
                            `<body>` +
                            `<p>Your interview is scheduled From: ${moment(req.body.startTime).format('LLLL')}\n To: ${moment(req.body.endTime).format('LLLL')}
            </p>` +
                            `</body>`;
                          // console.log(mailOptions);
                          smtp.temp(mailOptions);
                          if (
                            selectedInterviewers.indexOf(
                              selectedCandidates[i]
                            ) === -1
                          ) {
                            obj.role = false;
                          } else obj.role = true;
                          insertionArray.push(obj);
                        }
                        await UserInterviews.create(insertionArray)
                          .then(
                            (data) => {
                              res.statusCode = 200;
                              res.setHeader("Content-Type", "application/json");
                              res.json("Interview Scheduled");
                              res.end();
                            },
                            (err) => next(err)
                          )
                          .catch((err) => next(err));
                      },
                      (err) => next(err)
                    )
                    .catch((err) => next(err));
                }
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          await Interviews.create({
            startTime: req.body.startTime,
            endTime: req.body.endTime,
          })
            .then((data) => {
              return data._id;
            })
            .then(
              async (id) => {
                let insertionArray = [];
                let selectedCandidates = req.body.selectedCandidates,
                  selectedInterviewers = req.body.selectedInterviewers;
                // console.log(req.body.selectedCandidates,"ASDSADASDAS");
                let selectedCandidatesEmail = req.body.selectedCandidatesEmail;

                for (let i = 0; i < selectedCandidates.length; i++) {
                  let obj = { email: selectedCandidates[i], interview: id };
                  mailOptions.to = selectedCandidatesEmail[i];
                  mailOptions.html =
                    `<body>` +
                    `<p>Your interview is scheduled From: ${moment(req.body.startTime).format('LLLL')}\n To: ${moment(req.body.endTime).format('LLLL')}
            </p>` +
                    `</body>`;
                  // console.log(mailOptions);
                  smtp.temp(mailOptions);
                  if (
                    selectedInterviewers.indexOf(selectedCandidates[i]) === -1
                  ) {
                    obj.role = false;
                  } else obj.role = true;
                  insertionArray.push(obj);
                }
                await UserInterviews.create(insertionArray)
                  .then(
                    (data) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json("Interview Scheduled");
                      res.end();
                    },
                    (err) => next(err)
                  )
                  .catch((err) => next(err));
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
router.post("/:currentid", function (req, res, next) {
  if (req.body.selectedCandidates.length < 2) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode=400;
    res.json("Select atleast 2 candidates.");
    res.end();
    return;
  }
  console.log(req.params.currentid);
  // console.log(req.body);
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;
  Interviews.find({
    $and: [
      {
        $or: [
          {
            $and: [
              { startTime: { $gte: startTime } },
              { startTime: { $lte: endTime } },
            ],
          },
          {
            $and: [
              { startTime: { $lte: startTime } },
              { endTime: { $lte: endTime } },
              { endTime: { $gte: startTime } },
            ],
          },
          {
            $and: [
              { endTime: { $gte: startTime } },
              { endTime: { $lte: endTime } },
            ],
          },
        ],
      },
      { _id: { $ne: req.body.id } },
    ],
  })
    .then(async(data) => {
      let result = [];
      if (data.length) {
        result = data.map((a) => a._id.toString());
        // console.log(result);
        await UserInterviews.find({
          $and: [
            { interview: { $in: result } },
            { email: { $in: req.body.selectedCandidates } },
          ],
        })
        .then(async (data) => {
          if (data.length > 0) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json("Clashing Interviews");
            res.end();
            return;
          } else {
            await Interviews.findByIdAndUpdate(
              req.body.id,
              { startTime: req.body.startTime, endTime: req.body.endTime },
              { upsert: true }
            )
              .then(async(data) => {
                return data._id;
              })
              .then(async (id) => {
                let insertionArray = [];
                let selectedCandidates = req.body.selectedCandidates,
                  selectedInterviewers = req.body.selectedInterviewers;
                let selectedCandidatesEmail = req.body.selectedCandidatesEmail;
                // console.log(req.body.selectedCandidates,"ASDSADASDAS");
                for (let i = 0; i < selectedCandidates.length; i++) {
                  mailOptions.to = selectedCandidatesEmail[i];
                  mailOptions.html =
                    `<body>` +
                    `<p>Your interview is scheduled From: ${moment(req.body.startTime).format('LLLL')}\n To: ${moment(req.body.endTime).format('LLLL')}
              </p>` +
                    `</body>`;
                  // console.log(mailOptions);
                  smtp.temp(mailOptions);
                  let obj = { email: selectedCandidates[i], interview: id };
                  if (selectedInterviewers.indexOf(selectedCandidates[i]) === -1) {
                    obj.role = false;
                  } else obj.role = true;
                  insertionArray.push(obj);
                }
                await UserInterviews.deleteMany({ interview: id }).then(async() => {
                  await UserInterviews.create(insertionArray).then(() => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json("Interview Scheduled");
                    res.end();
                    return;
                  });
                });
              });
          }
        });
      } else {
        await Interviews.findByIdAndUpdate(
          req.body.id,
          { startTime: req.body.startTime, endTime: req.body.endTime },
          { upsert: true }
        )
          .then(async(data) => {
            return data._id;
          })
          .then(async (id) => {
            let insertionArray = [];
            let selectedCandidates = req.body.selectedCandidates,
              selectedInterviewers = req.body.selectedInterviewers;
            let selectedCandidatesEmail = req.body.selectedCandidatesEmail;
            // console.log(req.body.selectedCandidates,"ASDSADASDAS");
            for (let i = 0; i < selectedCandidates.length; i++) {
              mailOptions.to = selectedCandidatesEmail[i];
              mailOptions.html =
                `<body>` +
                `<p>Your interview is scheduled From: ${moment(req.body.startTime).format('LLLL')}\n To: ${moment(req.body.endTime).format('LLLL')}
          </p>` +
                `</body>`;
              // console.log(mailOptions);
              smtp.temp(mailOptions);
              let obj = { email: selectedCandidates[i], interview: id };
              if (selectedInterviewers.indexOf(selectedCandidates[i]) === -1) {
                obj.role = false;
              } else obj.role = true;
              insertionArray.push(obj);
            }
            console.log(insertionArray);
            await UserInterviews.deleteMany({ interview: id }).then(async() => {
              await UserInterviews.create(insertionArray).then(() => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json("Interview Scheduled");
                res.end();
                return;
              });
            });
          });
      }
    })
});

module.exports = router;
