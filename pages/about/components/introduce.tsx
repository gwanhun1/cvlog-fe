import { IntroduceInterface } from '..';

const Introduce = ({ Element }: { Element: IntroduceInterface }) => {
  return (
    <>
      {Element && (
        <section
          className={`flex flex-col p-10 tablet:flex-row ${
            Element.id % 2 === 0 ? 'tablet:flex-row-reverse' : ''
          } items-center justify-center w-full gap-8 tablet:gap-12 py-8 tablet:py-16 shadow-lg`}
        >
          {/* Video Section */}
          <article className="flex justify-center w-full px-4 tablet:px-8 tablet:w-3/5">
            <video
              src={Element.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-2xl rounded-xl shadow-xl aspect-video object-cover"
            />
          </article>

          {/* Content Section */}
          <article className="flex items-start w-full px-4 tablet:px-0 tablet:w-2/5">
            <div className="flex flex-col w-full gap-4 tablet:gap-6">
              {/* Title Section */}
              <div className="flex items-center gap-4">
                <div className="hidden tablet:flex items-center justify-center w-12 h-12 text-2xl font-medium text-white rounded-full bg-ftBlue">
                  {Element.id + 1}
                </div>
                <h1 className="text-xl tablet:text-3xl font-medium text-ftBlue">
                  {Element.title}
                </h1>
              </div>

              {/* Message Section */}
              <div className="flex flex-col gap-4">
                <p className="text-sm tablet:text-base text-gray-700">
                  {Element.message}
                </p>
                <p className="hidden tablet:block text-xs text-gray-600">
                  {Element.messageBr}
                </p>
              </div>
            </div>
          </article>
        </section>
      )}
    </>
  );
};

export default Introduce;
